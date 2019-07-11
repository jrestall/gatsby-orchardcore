import React from 'react'
import { useWidgets } from '../context/WidgetProvider'

const DEFAULTS = {
  wrapper: ({ children }) => React.createElement(React.Fragment, {}, children),
}

export default function ContentItem({ contentItem, ...props }) {
  const widgets = useWidgets(null)

  const contentType = contentItem.contentType
  const Component = widgets[contentType] || DEFAULTS[contentType]

  if (!Component) {
    console.log(`Couldn't find a widget mapping for the ${contentType} widget.`)
    return null
  }

  return React.createElement(Component, { contentItem, ...props })
}
