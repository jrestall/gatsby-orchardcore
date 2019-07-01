import { graphql } from 'gatsby'
import FlowPart from 'gatsby-theme-orchardcore-flows/src/components/FlowPart'
import React from 'react'
import Head from "./Head";
import Layout from './Layout';

export default function Page({ pageContext }) {
  return (
    <Layout pageContext={pageContext}>
      <Head page={pageContext.page} />
      <FlowPart part={pageContext.page.flow} />
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
