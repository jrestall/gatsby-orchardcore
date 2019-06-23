import FlowPart from 'gatsby-theme-orchardcore-flows'
import React from 'react'

export default function Page({ contentItem }) {
  return <FlowPart part={contentItem.flowPart} />
}
