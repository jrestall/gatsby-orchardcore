import { ContentBuilder } from "gatsby-theme-orchardcore-contents";
import _ from "lodash"

export default class LayerBuilder extends ContentBuilder {
  public async buildQuery(operations) {
    operations.push(`
      cms {
        siteLayers {
          name
          rule
          description
          widgets(status: PUBLISHED) {
            renderTitle
            position
            zone
            widget {
              ...Widgets
            }
          }
        }
      }`)
  }

  public setActiveWidgets(contentItem, activeWidgets, _widgetDefinitions, data) {
    if(!data.cms.siteLayers) {
      console.warn("No site layers configured for site or siteLayers query failed!")
      return
    }
  
    // Retrieve the siteLayers graphql query result.
    const layers = Object.values(data.cms.siteLayers) 
    
    // Get all active layers for this page
    const activeLayers = this.getActiveLayers(layers)
    
    if(!activeLayers) {
      console.log(`No active layers found.`)
      return
    }
  
    // Get the widget names used in zones on this page
    const layerWidgets = this.getWidgetsFromLayers(activeLayers)

    // Merge the layer widgets with any existing active widgets
    const widgets = _.union(activeWidgets, layerWidgets)
    for(const activeWidget of widgets) {
      activeWidgets.push(activeWidget)
    }

    // Group and order the widgets into named zones 
    const zones = this.getZonesFromLayers(activeLayers)

    // Add the zones collection to the contentItem so that it can be later used by ZoneProvider.
    contentItem.zones = zones
  }
    
  private getWidgetsFromLayers(layers) {
    const widgetNames = []
    layers.forEach(layer => {
      layer.widgets.forEach(layerWidget => {
        const widgetName = this.getWidgetName(layerWidget.widget)
        widgetNames.push(widgetName)
      })
    })
    return widgetNames
  }
  
  private getZonesFromLayers(layers) {
    const zones = new Object()
    layers.forEach(layer => {
      layer.widgets.forEach(layerWidget => {
        const zone = layerWidget.zone
        const position = layerWidget.position
        const widget = layerWidget.widget
        
        this.addToZone(zones, zone, position, widget)
      })
    })
    return zones
  }
  
  private addToZone(zones, name, position, widget) {
    const zone = zones[name]
    if(zone) {
      // Add widget to the correct position in the existing zone
      zone.push({position, widget})
      zone.sort(this.comparePosition)
    } else {
      // Create the Zone
      zones[name] = [{position, widget}]
    }
  }
  
  private comparePosition(a, b) {
    if (a.position > b.Position) {
      return 1;
    }
    if (a.position < b.Position) {
      return -1;
    }
    return 0;
  }
  
  private getActiveLayers(layers) {
    // TODO: Filter based on layer.rule using new Function(url, isAuthenticated, isAnonymous, culture, 'return ${rule}');
    return layers
  }
  
  private getWidgetName(contentItem) {
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