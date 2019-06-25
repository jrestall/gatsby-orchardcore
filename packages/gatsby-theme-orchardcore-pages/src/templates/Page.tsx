import { graphql } from 'gatsby'
import FlowPart from 'gatsby-theme-orchardcore-flows/src/components/FlowPart'
import React from 'react'

export default function Page({ pageContext }) {
  return <FlowPart part={pageContext.page.flow} />
}

export const widget = graphql`
  fragment Page on CMS_Page {
    contentItemId
    contentType
    path
    displayText
    flow {
      ...Widgets
    }
  }
`
