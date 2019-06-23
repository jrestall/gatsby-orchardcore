import fs from 'fs'
import { writeFileSync } from 'fs-extra'
import mkdirp from 'mkdirp'

export default function buildFlowTemplate(
  name: string,
  baseTemplate: string,
  contentItem: any,
  store: any,
  getNodesByType: any
): string {
  // Deep search the properties on the contentItem object for 'flowPart'.
  // This will tell us all widgets that are used by this content item so
  // that we can create a unique component and ensure code splitting works.
  const widgets = findWidgets(contentItem)
  if (!widgets) {
    return null
  }

  // Get all widgets details used by this content item.
  const widgetNodes = getNodesByType(`Widget`).filter(n =>
    widgets.includes(n.name)
  )

  // Output a new component with imports and widget mappings for this specific content item
  const componentTemplate = `
        import React from 'react'
        import { WidgetProvider } from '../context/WidgetProvider'
        import BaseTemplate from '${baseTemplate}'
        ${widgetNodes.map(
          widget => `import ${widget.name} from '${widget.path}'`
        )}

        export default function FlowTemplate(props) {
            const widgets = {
                ${widgetNodes.map(widget => `'${widget.name}':${widget.name},`)}
            }
            return (
                <WidgetProvider widgets={widgets}>
                    <BaseTemplate {...props} />
                </WidgetProvider>
            )
        }`

  // Save to cache and return file path
  const program = store.getState().program
  const flowTemplatesDir = `${program.directory}/.cache/flow-templates`
  ensureDirectory(flowTemplatesDir)

  const templatePath = `${flowTemplatesDir}/${name}.jsx`
  writeFileSync(templatePath, componentTemplate)

  return templatePath
}

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir)
  }
}

function findWidgets(contentItem: any): string[] {
  if (!contentItem) {
    return null
  }

  const widgets: string[] = []

  const widgetName = getWidgetName(contentItem)
  if (!widgetName) {
    return
  }

  widgets.push(widgetName)

  if (contentItem.flowPart) {
    const contentWidgets = contentItem.flowPart.widgets
    for (const widget in contentWidgets) {
      if (contentWidgets.hasOwnProperty(widget)) {
        const childWidgets = findWidgets(widget)
        if (childWidgets) {
          widgets.concat(childWidgets)
        }
      }
    }
  }

  return widgets
}

function getWidgetName(contentItem: any) {
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
