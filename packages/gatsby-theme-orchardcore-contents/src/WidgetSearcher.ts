import { readFileSync } from 'fs-extra'
import getGatsbyDependents from 'gatsby/dist/utils/gatsby-dependents'
import glob from 'glob'
import _ from 'lodash'
import normalize from 'normalize-path'
import path from 'path'
import { WidgetDefinition } from './types'

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
  public async find(): Promise<WidgetDefinition[]> {
    const files = await this.getAllFiles()
    const definitions = await this.parseAllFiles(files)

    return definitions
  }

  private async parseAllFiles(files: string[]): Promise<WidgetDefinition[]> {
    const widgets: WidgetDefinition[] = []

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

  private async parseFile(file: string): Promise<WidgetDefinition> {
    let widget: WidgetDefinition

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

  private async getAllFiles(): Promise<string[]> {
    // TODO: swap plugins to themes
    const { themes, flattenedPlugins } = this.store.getState()
    const themeDirs = this.resolveThemes(
      themes.themes
        ? themes.themes
        : flattenedPlugins.map(plugin => {
            return {
              themeDir: plugin.pluginFilepath,
            }
          })
    )
  
    const filesRegex = `*.+(t|j)s?(x)`
    // Pattern that will be appended to searched directories.
    // It will match any .js, .jsx, .ts, and .tsx files, that are not
    // inside <searched_directory>/node_modules.
    const pathRegex = `/{${filesRegex},!(node_modules)/**/${filesRegex}}`

    const modulesThatUseGatsby = await getGatsbyDependents()

    let files = [
      path.join(this.basePath, `src`),
      path.join(this.basePath, `.cache`, `fragments`),
    ]
      .concat(themeDirs.map(additional => path.join(additional, `src`)))
      .concat(modulesThatUseGatsby.map(module => module.path))
      .reduce(
        (merged, folderPath) =>
          merged.concat(
            glob.sync(path.join(folderPath, pathRegex), {
              nodir: true,
            })
          ),
        []
      )

    files = files.filter(d => !d.match(/\.d\.ts$/))

    files = files.map(normalize)
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
