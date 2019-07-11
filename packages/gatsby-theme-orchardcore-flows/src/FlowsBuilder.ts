import { ContentBuilder } from "gatsby-theme-orchardcore-contents";
import _ from "lodash"

export default class FlowsBuilder extends ContentBuilder {
  public setActiveWidgets(content, activeWidgets) {
    const flowWidgets = this.findWidgets(content)

    
    // Merge the FlowPart widgets with any existing active widgets
    const widgets = _.union(activeWidgets, flowWidgets)
    
    for(const activeWidget of widgets) {
      activeWidgets.push(activeWidget)
    }
  }

  // Deep search the properties on the contentItem object for a 'flow' property.
  // This will tell us all widgets that are used by this content item so
  // that we can create a unique component and ensure code splitting works.
  private findWidgets(contentItem) {
    if (!contentItem) {
      return null
    }
  
    let widgets: string[] = []
  
    const widgetName = this.getWidgetName(contentItem)
    if (!widgetName) {
      return
    }
  
    widgets.push(widgetName)
  
    if (contentItem.flow) {
      const contentWidgets = contentItem.flow.widgets
      for (const widget of contentWidgets) {
        const childWidgets = this.findWidgets(widget)
        if (childWidgets) {
          const combinedWidgets = _.union(widgets, childWidgets)
          widgets = combinedWidgets
        }
      }
    }
  
    return widgets
  }
  
  private getWidgetName(contentItem: any) {
    if (!contentItem) {
      return null
    }
    if (contentItem.contentType) {
      return contentItem.contentType
    }
    if (contentItem.__typename) {
      return contentItem.__typename
    }
  }
}