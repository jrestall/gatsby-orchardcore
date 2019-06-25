import React from 'react'
import ContentItem from './ContentItem';

export function Widgets({ widgets }) {
  if (!widgets) {
    return null
  }

  // Loop through all the widget content items and render
  return widgets.map((widget, index) => (
    <ContentItem key={index} contentType={widget.contentType} contentItem={widget} />
  ))
}

export default function FlowPart({ part }) {
  if (!part) {
    return null
  }
  return <Widgets widgets={part.widgets} />
}
