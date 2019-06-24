import MuiButton from '@material-ui/core/Button'
import { graphql } from 'gatsby'
import React from 'react'

function Button({ contentItem, ...rest }) {
  const { button, formElement, formInputElement } = contentItem
  const fieldName = formInputElement.name
  return (
    <MuiButton
      id={formElement.id}
      type={button.type}
      disableRipple={true}
      variant="contained"
      name={fieldName}
      color="primary"
      {...rest}
    >
      {button.text}
    </MuiButton>
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
