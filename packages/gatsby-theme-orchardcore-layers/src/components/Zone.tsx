import ContentItem from 'gatsby-theme-orchardcore-flows/src/components/ContentItem';
import React from 'react'
import { useLayers } from '../context/LayerProvider'

export default function Zone({ name, children }) {
  const layers = useLayers({})

  // Get active layers
  const activeLayers = layers.filter(layer => evaluateRule(layer.rule))

  // Get layer's widgets for this zone
  const zoneName = name.toUpperCase();

  let layerWidgets = []
  activeLayers.forEach(layer => {
    if(!layer || !layer.widgets) {
      return
    }
    const activeWidgets = layer.widgets.filter(widget => widget.zone.toUpperCase() === zoneName)
    layerWidgets = [...activeWidgets, ...layerWidgets]
  })

  // Order widgets by their position
  layerWidgets = layerWidgets.sort((a,b) => a.position > b.position)

  return (
    <div className={`zone-${name}`}>
      {layerWidgets.map((layerWidget, index) => <ContentItem contentItem={layerWidget.widget} key={index} />)}
      {children}
    </div>
  )

  function evaluateRule(rule: string) {
    // url('/home') 
    // isAuthenticated()
    // isAnonymous() 
    // isHomepage() 
    // culture('en-NZ')
    // true
    return true
  }
}

export default function Zone({ name, children }) {
  const zones = useZones()

  const widgets = zones[name];
  return (
    <div className={`zone-${name}`}>
      {widgets && widgets.map((widget, index) => <ContentItem contentItem={widget} key={index} />)}
      {children}
    </div>
  )
}