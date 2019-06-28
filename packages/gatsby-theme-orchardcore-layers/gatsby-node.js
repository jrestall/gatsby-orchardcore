exports.onCreatingTemplate = async ({ page, widgets }) => {
  console.log('gatsby-theme-orchardcore-layers:onCreatingTemplate')

  // Run the graphql query against the CMS to get all configured layers
  const layers = await getLayers();

  // Get all active layers for this page
  const activeLayers = getActiveLayers(layers)
  
  // Get the ordered widgets used in zones on this page
  //const widgets = getWidgetsFromLayers(activeLayers)
  widgets.push(widgets)

  // Group and order the widgets into named zones 
  const zones = getZonesFromLayers(activeLayers)
  page.zones = zones
}

async function getLayers() {
  const { cms } = await graphql(`
    query SiteLayers {
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
      }
    }
  `)

  return Object.values(cms.siteLayers) 
}

function getActiveLayers(layers) {
  // TODO: Filterbased on layer.rule using new Function(url, isAuthenticated, isAnonymous, culture, 'return ${rule}');
  return layers
}