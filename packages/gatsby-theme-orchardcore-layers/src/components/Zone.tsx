import ContentItem from 'gatsby-theme-orchardcore-flows/src/components/ContentItem';
import React from 'react'
import { useZones } from '../context/ZoneProvider'

export default function Zone({ name, ...props }) {
  const zones = useZones()

  const widgets = zones[name];
  return (
    <div className={`zone-${name}`}>
      {widgets && widgets.map((zoneWidget, index) => <ContentItem contentItem={zoneWidget.widget} key={index} />)}
      {props.children}
    </div>
  )
}