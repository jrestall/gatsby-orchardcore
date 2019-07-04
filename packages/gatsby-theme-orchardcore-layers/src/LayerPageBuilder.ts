export interface IPageBuilder {
  new (actions any): PageBuilder;
  buildPageQuery(query: string): void;
  buildPageTemplate(template: string): void;
  buildPage(page: any): void;
}

abstract class PageBuilder implements IPageBuilder {
  buildPageQuery(query: string) {/*default implementation*/}
  buildPageTemplate(template: string) {/*default implementation*/}
  buildPage(page: any) {/*default implementation*/}
}

export interface ContentItem {
  __typename: string;
  contentType: string;
}

export interface PageTemplate {
  page: ContentItem;
  widgets: string[];
  template: string;
}



public class LayerPageBuilder extends PageBuilder {
  buildPageQuery(operations: string[], fragments: string[]) {
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

  buildPageTemplate(template: PageTemplate, queryResult: any) {
    console.log('gatsby-theme-orchardcore-layers:onCreatingTemplate')

    if(!result.data.cms.siteLayers) {
      console.warn("No site layers configured for site!")
      return
    }
  
    // Retrieve the siteLayers graphql query result.
    const layers = Object.values(result.data.cms.siteLayers) 
    
    // Get all active layers for this page
    const activeLayers = getActiveLayers(layers)
    
    if(!activeLayers) {
      console.log(`No active layers found.`)
      return
    }
    
    // Get the widget names used in zones on this page
    const widgets = getWidgetsFromLayers(activeLayers) 
    template.widgets.concat(widgets)
  
    // Group and order the widgets into named zones 
    const zones = getZonesFromLayers(activeLayers)
    template.page.zones = zones
  }
}