
import React from 'react'
import LayerLayout from '../../components/Layout'
import { ZoneProvider } from '../../context/ZoneProvider'

export default function Layout({ pageContext, children }) {
  const zones = pageContext.contentItem.zones
  return (
    <>
      <ZoneProvider zones={zones}>
        <LayerLayout>
          {children}
        </LayerLayout>
      </ZoneProvider>
    </>
  )
}