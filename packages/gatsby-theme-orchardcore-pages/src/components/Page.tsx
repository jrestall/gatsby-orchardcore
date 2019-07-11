import { graphql } from 'gatsby'
import { FlowPart } from 'gatsby-theme-orchardcore-flows'
import React from 'react'
import Head from './Head'
import Layout from './Layout'

export default function Page({ pageContext }) {
  const page = pageContext.contentItem
  return (
    <Layout pageContext={pageContext}>
      <Head page={page} />
      <FlowPart part={page.flow} />
    </Layout>
  )
}

export const widget = graphql`
  fragment Page on CMS_Page {
    contentItemId
    contentType
    path
    displayText
    description
    background {
      urls
    }
    flow {
      widgets {
        ...Widgets
      }
    }
    localization {
      culture
    }
  }
`
