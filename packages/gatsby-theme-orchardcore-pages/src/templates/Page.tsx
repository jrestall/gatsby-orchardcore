import FlowPart from 'gatsby-theme-orchardcore-flows/src/components/FlowPart'
import React from 'react'

export default function Page({ data }) {
  return <FlowPart part={data.cms.page[0].flowPart} />
}
