import React from 'react'
import FlowPart from '../components/FlowPart'
import { WidgetProvider } from '../context/WidgetProvider'

export default function FlowComponent({ children }) {
  const widgets = {
    FlowPart: FlowPart,
  }
  return <WidgetProvider widgets={widgets}>{children}</WidgetProvider>
}
