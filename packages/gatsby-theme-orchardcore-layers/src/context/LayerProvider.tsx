import React from 'react'

const isFunction = obj => typeof obj === 'function'

const LayerContext = React.createContext({})

export const useLayers = layers => {
  const contextLayers = React.useContext(LayerContext)
  let allLayers = contextLayers
  if (layers) {
    allLayers = isFunction(layers)
      ? components(contextLayers)
      : [ ...contextLayers, ...layers ]
  }

  return allLayers
}

export const LayerProvider = props => {
  const allLayers = useLayers(props.layers)

  return (
    <LayerContext.Provider value={allLayers}>
      {props.children}
    </LayerContext.Provider>
  )
}

export default LayerContext
