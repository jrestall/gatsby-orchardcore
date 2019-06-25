import React from 'react'
import { useWidgets } from '../context/WidgetProvider'

const DEFAULTS = {
  wrapper: ({ children }) => React.createElement(React.Fragment, {}, children),
}

export default function ContentItem({ contentType, ...props }) {
  const components = useWidgets(null)
  const Component = components[contentType] || DEFAULTS[contentType]

  if (!Component) {
    console.log(`Couldn't find a widget mapping for the ${contentType} widget.`)
    return null
  }

  return React.createElement(Component, props)
}