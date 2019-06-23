import React from 'react'
import { useWidgets } from '../context/WidgetProvider'

const DEFAULTS = {
  FlowPart,
  wrapper: ({ children }) => React.createElement(React.Fragment, {}, children),
}

export function WidgetElement({ type, ...props }) {
  const components = useWidgets(null)
  const Component = components[type] || DEFAULTS[type]

  if (!Component) {
    console.log(`Couldn't find a widget mapping for the ${type} widget.`)
    return null
  }

  return React.createElement(Component, props)
}

export function Widgets({ widgets }) {
  if (!widgets) {
    return null
  }

  // Loop through all the widget content items and render
  return widgets.map((widget, index) => (
    <WidgetElement key={index} type={widget.contentType} {...widget} />
  ))
}

export default function FlowPart({ part }) {
  if (!part) {
    return null
  }
  return <Widgets widgets={part.widgets} />
}
