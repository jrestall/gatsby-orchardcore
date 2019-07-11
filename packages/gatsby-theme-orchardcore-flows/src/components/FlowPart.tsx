import { graphql } from 'gatsby'
import { ContentItem } from 'gatsby-theme-orchardcore-contents'
import React from 'react'

export function Widgets({ widgets }) {
  if (!widgets) {
    return null
  }

  // Loop through all the widget content items and render
  return widgets.map((widget, index) => (
    <ContentItem key={index} contentItem={widget} />
  ))
}

export default function FlowPart({ part }) {
  if (!part) {
    return null
  }
  return <Widgets widgets={part.widgets} />
}

export const query = graphql`
  fragment FlowPart on CMS_FlowPart {
    widgets {
      ...Widgets  
    }
  }
`
