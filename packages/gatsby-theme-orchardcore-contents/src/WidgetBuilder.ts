import ContentBuilder from './ContentBuilder'
import { WidgetDefinition } from './types';
import WidgetSearcher from './WidgetSearcher'
import WidgetsFragment from './WidgetsFragment'

export default class WidgetBuilder extends ContentBuilder {
  private store: any = {}
  private reporter: any = {}
  private widgetDefinitions: WidgetDefinition[] = []

  constructor ({store, reporter}) {
    super()
    this.store = store
    this.reporter = reporter
  }

  /**
   * Finds all widget fragments and automatically includes them in the Widgets fragment.
   */
  public async buildQuery(_operations, fragments) {
    const program = this.store.getState().program

    console.log('Searching for widgets...')
    this.widgetDefinitions = await this.findWidgets(program.directory)

    console.log('Creating widgets fragment...')
    const fragment = new WidgetsFragment(this.widgetDefinitions)
    const widgetsFragment = fragment.toString()

    // Add the Widgets fragment to the content query so that any queries can use the fragment.
    fragments.push(widgetsFragment)

    // Add each individual widget fragment to the query e.g. Button, Markdown
    for(const widget of this.widgetDefinitions) {
      fragments.push(widget.fragment)
    }

    console.log('Saving widgets fragment...')
    await fragment.saveToDisk(
      `${program.directory}/.cache/fragments/orchardcore-contents-widgets.js`
    )
  }

  public buildWidgets(_contentItem, widgetDefinitions: WidgetDefinition[]) {
    for(const definition of this.widgetDefinitions) {
      widgetDefinitions.push(definition)
    }
  }

  private async findWidgets(directory) {
    // Find all widgets based on presence of 'export const widget = graphql'
    const widgetSearcher = new WidgetSearcher(directory, this.store, this.reporter)
    const widgets = await widgetSearcher.find()

    if (!widgets) {
      console.warn(`gatsby-theme-orchardcore-contents didn't find any widgets!`)
      return null
    }

    return widgets
  }
}