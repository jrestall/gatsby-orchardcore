import React from 'react'

const isFunction = obj => typeof obj === 'function'

const WidgetContext = React.createContext({})

export const withWidgets = Component => props => {
  const allComponents = useWidgets(props.components)

  return <Component {...props} components={allComponents} />
}

export const useWidgets = components => {
  const contextComponents = React.useContext(WidgetContext)
  let allComponents = contextComponents
  if (components) {
    allComponents = isFunction(components)
      ? components(contextComponents)
      : { ...contextComponents, ...components }
  }

  return allComponents
}

export const WidgetProvider = props => {
  const allWidgets = useWidgets(props.widgets)

  return (
    <WidgetContext.Provider value={allWidgets}>
      {props.children}
    </WidgetContext.Provider>
  )
}

export default WidgetContext
