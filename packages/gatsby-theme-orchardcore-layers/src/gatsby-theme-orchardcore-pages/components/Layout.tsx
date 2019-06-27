
import React from 'react'
import LayerLayout from '../../components/Layout'
import { LayerProvider } from '../../context/LayerProvider'
import useSiteLayers from '../../hooks/useSiteLayers'

export default function Layout({ children }) {
  const siteLayers = useSiteLayers()
  return (
    <>
      <LayerProvider layers={siteLayers}>
        <LayerLayout>
          {children}
        </LayerLayout>
      </LayerProvider>
    </>
  )
}