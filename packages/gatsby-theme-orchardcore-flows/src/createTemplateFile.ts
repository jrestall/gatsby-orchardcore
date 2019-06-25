import fs from 'fs'
import { writeFileSync } from 'fs-extra'
import _ from 'lodash'
import mkdirp from 'mkdirp'
import slash from 'slash'

export default function createTemplateFile(
  name: string,
  contentItem: any,
  store: any,
  getNodesByType: any
): string {
  // Deep search the properties on the contentItem object for a 'flow' property.
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
import { WidgetProvider } from '${slash(require.resolve('./context/WidgetProvider'))}'
import ContentItem from '${slash(require.resolve('./components/ContentItem'))}'
${widgetNodes.map(widget => `import ${widget.name} from '${slash(widget.path)}'; `).join('')}

export default function FlowTemplate(props) {
    const widgets = {
        ${widgetNodes.map(widget => `'${widget.name}':${widget.name}`)}
    }
    return (
        <WidgetProvider widgets={widgets}>
            <ContentItem contentType={'${contentItem.contentType}'} {...props} />
        </WidgetProvider>
    )
}
`

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

  let widgets: string[] = []

  const widgetName = getWidgetName(contentItem)
  if (!widgetName) {
    return
  }

  widgets.push(widgetName)

  if (contentItem.flow) {
    const contentWidgets = contentItem.flow.widgets
    for (const widget of contentWidgets) {
      const childWidgets = findWidgets(widget)
      if (childWidgets) {
        const combinedWidgets = _.union(widgets, childWidgets)
        widgets = combinedWidgets
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
