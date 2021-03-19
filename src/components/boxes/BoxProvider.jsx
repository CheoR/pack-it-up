import React, { createContext, useState } from "react"


const baseURL = `http://localhost:8088`

export const BoxContext = createContext()

export const BoxProvider = ( props ) => {

 const [boxes, setBoxes] = useState([])

 const getBoxes = () => {
  return fetch(`${baseURL}/boxes?_expand=move`)
   .then(res => res.json())
   .then(setBoxes)
 } // getBoxes

 
 return (
  <BoxContext.Provider value={{
   boxes,
   getBoxes,
   setBoxes
  }}>
   { props.children }
  </BoxContext.Provider>
 )
}
