import React from 'react'

const ZoneContext = React.createContext({})

export const useZones = () => {
  const contextZones = React.useContext(ZoneContext)
  return contextZones
}

export const ZoneProvider = props => {
  return (
    <ZoneContext.Provider value={props.zones}>
      {props.children}
    </ZoneContext.Provider>
  )
}

export default ZoneContext
