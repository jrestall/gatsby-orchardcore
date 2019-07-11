export interface WidgetDefinition {
  name: string
  path: string
  fragment: string
}

export interface IContentBuilder {
  buildQuery(operations, fragments)
  buildWidgets(contentItem, widgetDefinitions)
  setActiveWidgets(contentItem, activeWidgets, widgetDefinitions, data)
  createPage(content, template, data)
}
