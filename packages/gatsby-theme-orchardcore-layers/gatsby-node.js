exports.onCreatingTemplate = async ({ page, result, addWidget, graphql }) => {
  console.log('gatsby-theme-orchardcore-layers:onCreatingTemplate')

  if(!result.data.cms.siteLayers) {
    console.warn("No site layers configured for site!")
    return
  }

  // Retrieve the siteLayers graphql query result.
  const layers = Object.values(result.data.cms.siteLayers) 
  
  // Get all active layers for this page
  const activeLayers = getActiveLayers(layers)
  
  // Get the widget names used in zones on this page
  const widgets = getWidgetsFromLayers(activeLayers)
  
  for(let widget of widgets) {
    addWidget(widget)
  }

  // Group and order the widgets into named zones 
  const zones = getZonesFromLayers(activeLayers)
  page.zones = zones
}

exports.sourcePageQuery = async ({ addOperations }) => {
  console.log('gatsby-theme-orchardcore-layers:sourcePageQuery')

  const layersQuery = `
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
    }`

  addOperations(layersQuery)
}

function getWidgetsFromLayers(layers) {
  const widgetNames = []
  layers.forEach(layer => {
    layer.widgets.forEach(layerWidget => {
      const widgetName = getWidgetName(layerWidget.widget)
      widgetNames.push(widgetName)
    })
  })
  return widgetNames
}

function getZonesFromLayers(layers) {
  const zones = new Map()
  layers.forEach(layer => {
    layer.widgets.forEach(layerWidget => {
      const zone = layerWidget.zone
      const position = layerWidget.position
      const widget = layerWidget.widget
      
      addToZone(zones, zone, position, widget)
    })
  })
  return zones
}

function addToZone(zones, name, position, widget) {
  let zone = zones.get(name)
  if(zone) {
    // Add widget to the correct position in the existing zone
    zone.push({position, widget})
    zone.sort(comparePosition)
  } else {
    // Create the Zone
    zones.set(name, [{position, widget}])
  }
}

function comparePosition(a, b) {
  if (a.position > b.Position) {
    return 1;
  }
  if (a.position < b.Position) {
    return -1;
  }
  return 0;
}

function getActiveLayers(layers) {
  // TODO: Filterbased on layer.rule using new Function(url, isAuthenticated, isAnonymous, culture, 'return ${rule}');
  return layers
}

function getWidgetName(contentItem) {
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