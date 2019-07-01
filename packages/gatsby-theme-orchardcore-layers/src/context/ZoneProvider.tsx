import React from 'react'

const ZoneContext = React.createContext({})

export const useZones = () => {
  const contextZones = React.useContext(ZoneContext)
  return contextZones
}

export const ZoneProvider = props => {
  const allZones = useZones()
  return (
    <ZoneContext.Provider value={allZones}>
      {props.children}
    </ZoneContext.Provider>
  )
}

export default ZoneContext
