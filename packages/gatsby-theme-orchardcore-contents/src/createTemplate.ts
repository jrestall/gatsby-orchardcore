import slash from 'slash'

export default function createTemplate(
  activeWidgets: any,
  widgetDefinitions: any
): string {

  if (!activeWidgets || activeWidgets.length <= 0) {
    return null
  }

  // Get all active widget definitions used by this content item.
  const activeWidgetDefinitions = widgetDefinitions.filter(w =>
    activeWidgets.includes(w.name)
  )

  // Output a new component with imports and widget mappings for this specific content item
  const template = `
import React from 'react'
import { WidgetProvider } from '${slash(require.resolve('./context/WidgetProvider'))}'
import ContentItem from '${slash(require.resolve('./components/ContentItem'))}'
${activeWidgetDefinitions.map(widget => `import ${widget.name} from '${slash(widget.path)}'; `).join('\n')}

export default function PageTemplate(props) {
  const widgets = {
${activeWidgetDefinitions.map(widget => `\t\t'${widget.name}':${widget.name}`).join(',\n')}
  }
  return (
    <WidgetProvider widgets={widgets}>
      <ContentItem contentItem={props.pageContext.contentItem} {...props} />
    </WidgetProvider>
  )
}
`
  return template
}