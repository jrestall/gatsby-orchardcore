import crypto from 'crypto'
import { Widget } from './types'

export default class WidgetStore {
  createNode: any

  constructor(createNode: any) {
    this.createNode = createNode
  }

  public save(widgets: Widget[]) {
    widgets.forEach(widget => {
      this.saveWidget(widget)
    })
  }

  private saveWidget(widget: Widget) {
    this.createNode({
      // Data for the node.
      ...widget,

      // Required fields.
      id: widget.name,
      parent: null,
      children: [],
      internal: {
        type: `Widget`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(widget.path))
          .digest(`hex`),
        description: `Widget`, // optional
      },
    })
  }
}
