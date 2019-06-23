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

    return `fragment FlowPartWidgets on CMS_FlowPart {
      widgets {
        ${this.widgets.map(widget => `...${widget.name}`)}
      }
    }`
  }
}
