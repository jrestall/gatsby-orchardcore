import { readFileSync } from 'fs-extra'
import glob from 'glob'
import _ from 'lodash'
import normalize from 'normalize-path'
import path from 'path'
import { Widget } from './types'

export default class WidgetSearcher {
  basePath: string
  store: any
  reporter: any

  constructor(basePath: string, store: any, reporter: any) {
    this.basePath = basePath
    this.store = store
    this.reporter = reporter
  }

  /**
   * Find all defined widgets in the project
   */
  public async find(): Promise<Widget[]> {
    const files = this.getAllFiles()
    const definitions = await this.parseAllFiles(files)

    return definitions
  }

  private async parseAllFiles(files: string[]): Promise<Widget[]> {
    const widgets: Widget[] = []

    return Promise.all(
      files.map(file =>
        this.parseFile(file).then(widget => {
          if (!widget) {
            return
          }
          widgets.push(widget)
        })
      )
    ).then(() => widgets)
  }

  private async parseFile(file: string): Promise<Widget> {
    let widget: Widget

    if(!file) {
      return null
    }

    // console.log(`Searching... ${file}`)

    // Look through each file for 'export const widget = graphql` fragment n '
    let fileContent
    try {
      fileContent = readFileSync(file, `utf8`)
    } catch (err) {
      this.reporter.error(`There was a problem reading the file: ${file}`, err)
      return
    }

    // Extract the widget fragment from the file
    const widgetRegex = new RegExp('\nexport const widget = graphql`([\\s\\S]*)`')
    const widgetResult = fileContent.match(widgetRegex)
    if (!widgetResult) {
      return null
    }

    // Extract the widget name from the fragment
    const fragmentContent = widgetResult[1]
    const fragmentRegex = new RegExp('fragment (.*) on ')
    const fragmentResult = fragmentContent.match(fragmentRegex)
    if (!fragmentResult) {
      return null
    }

    widget = { name: fragmentResult[1], fragment: widgetResult[1], path: file }
    console.log(`Found widget ${widget.name} in file: ${file}`)

    return widget
  }

  private getAllFiles(): string[] {
    const { themes, flattenedPlugins } = this.store.getState()
    const themeDirs = this.resolveThemes(
      themes.themes
      ? themes.themes
      : flattenedPlugins.map(plugin => {
          return {
            themeDir: plugin.resolve,
          }
        })
    )
  
    const filesRegex = path.join(`/**`, `*.+(t|j)s?(x)`)
    let files = [
      path.join(this.basePath, `src`),
      path.join(this.basePath, `.cache`, `fragments`),
      ...themeDirs
    ].reduce(
      (merged, folderPath) =>
        merged.concat(
          glob.sync(path.join(folderPath, filesRegex), {
            nodir: true,
          })
        ),
      []
    )
    files = files.filter(d => !d.match(/\.d\.ts$/))
    files = files.map(normalize)

    // Ensure all page components added as they're not necessarily in the
    // pages directory e.g. a plugin could add a page component.  Plugins
    // *should* copy their components (if they add a query) to .cache so that
    // our babel plugin to remove the query on building is active (we don't
    // run babel on code in node_modules). Otherwise the component will throw
    // an error in the browser of "graphql is not defined".
    files = files.concat(
      Array.from(this.store.getState().components.keys(), c => normalize(c))
    )
    files = _.uniq(files)

    return files
  }

  private resolveThemes(themes = []): string[] {
    return themes.reduce((merged, theme) => {
      merged.push(theme.themeDir)
      return merged
    }, [])
  }
}
