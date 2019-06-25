import { graphql } from 'gatsby'
import React from 'react'

function Button({ contentItem }) {
  const { button, formElement } = contentItem
  return (
    <button
      id={formElement.id}
      type={button.type}
    >
      {button.text}
    </button>
  )
}

export default Button

export const widget = graphql`
  fragment Button on CMS_Button {
    button {
      text
      type
    }
    formElement {
      id
    }
    formInputElement {
      name
    }
    metadata {
      alignment
      size
    }
  }
`
