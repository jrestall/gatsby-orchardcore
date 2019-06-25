import { writeFileSync } from 'fs-extra'
import { Widget } from './types'

export default class FlowPartFragment {
  widgets: Widget[]

  constructor(widgets: Widget[]) {
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

export const query = graphql\`
  ${this.buildFragment()}
\`
`
  }

  private buildFragment() {
    if (this.widgets.length === 0) {
      return ``
    }

    // Page is a special case that shouldn't be listed in the widget fragment.
    const filtered = this.widgets.filter(n =>
      n.name !== 'Page'
    )

    return `fragment Widgets on CMS_FlowPart {
      widgets {
        __typename
        contentType
        ${filtered.map(widget => `...${widget.name}`)}
      }
    }`
  }
}
