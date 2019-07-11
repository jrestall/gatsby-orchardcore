import { writeFileSync } from 'fs-extra'
import { WidgetDefinition } from './types'

// Creates the Widgets graphql fragment based on all the found widgets.
// e.g.
// fragment Widgets on CMS_ContentItem {
//  ...Button
//  ...Form
//  ...Paragraph
// }
// This can then be used to query for all widgets and their details on a content item.
export default class FlowPartFragment {
  widgets: WidgetDefinition[]

  constructor(widgets: WidgetDefinition[]) {
    this.widgets = widgets
  }

  public saveToDisk(path: string) {
    const fragment = this.buildFragmentFile()
    writeFileSync(path, fragment)
  }

  public toString() {
    return this.buildFragment()
  }

  private buildFragmentFile(): string {
    return `import { graphql } from "gatsby"

export const query = graphql\`${this.buildFragment()}\``
  }

  private buildFragment() {
    if (this.widgets.length === 0) {
      return ``
    }

    // Page is a special case that shouldn't be listed in the widget fragment.
    const filtered = this.widgets.filter(n =>
      n.name !== 'Page'
    )

    return `
    fragment Widgets on CMS_ContentItem {
      __typename
      contentType
      ${filtered.map(widget => `...${widget.name}`).join('\n\t  ')}
    }`
  }
}
