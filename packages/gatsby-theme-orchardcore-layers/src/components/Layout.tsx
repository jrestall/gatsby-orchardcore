import React from 'react'
import Zone from './Zone'

export default function Layout({ children }) {
  return (
    <>
      <Zone name="Header" />
      <Zone name="Navigation" />

      <Zone name="Content">
        {children}
      </Zone>

      <Zone name="FooterQuadFirst" />
      <Zone name="FooterQuadSecond" />
      <Zone name="FooterQuadThird" />
      <Zone name="FooterQuadFourth" />

      <Zone name="Footer" />
    </>
  )
}