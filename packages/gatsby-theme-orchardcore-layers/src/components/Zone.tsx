import ContentItem from 'gatsby-theme-orchardcore-flows/src/components/ContentItem';
import React from 'react'
import { useLayers } from '../context/LayerProvider'
import Zone from './Zone'

export default function Layout({ name, children }) {
  const layers = useLayers()

  // Get active layers
  const activeLayers = layers.filter(layer => evaluateRule(layer.rule))

  // Get layer's widgets for this zone
  const zoneName = name.toUpperCase();

  let widgets = []
  activeLayers.forEach(layer => {
    if(!layer || !layer.widgets) return
    const activeWidgets = layer.widgets.filter(widget => widget.zone.toUpperCase() === zoneName)
    widgets = [...activeWidgets, ...widgets]
  })

  // Order widgets by their position
  widgets = widgets.sort((a,b) => a.position > b.position)

  return (
    <div className={`zone-${name}`}>
      {widgets.map((widget, index) => <ContentItem contentType={widget.widget.contentType} contentItem={widget.widget} key={index} />)}
    </div>
  )

  function evaluateRule() {
    return true
  }
}