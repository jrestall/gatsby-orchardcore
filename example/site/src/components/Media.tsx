import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'

function Media({ contentItem }) {
  const { link, content } = contentItem
  return (
    link.url ? ( 
      <a href={link.url}>
        <Img fluid={content.fluid} alt={link.text} />
      </a>
    ) : (
      <Img fluid={content.fluid} alt={link.text} />
    )
  )
}

export const widget = graphql`
  fragment Media on CMS_Media {
    link {
      text
      url
    }
    content {
      urls
    }
    metadata {
      alignment
      size
    }
  }
`

export default Media
