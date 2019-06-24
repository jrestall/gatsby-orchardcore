import { graphql } from 'gatsby'
import React from 'react';

export default function Button() {
    return (
        <button name="test" />
    )
}

export const widget = graphql`
    fragment Button on CMS_Button {
        formElement {
            id
        }
    }
`