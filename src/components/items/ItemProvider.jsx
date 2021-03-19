import React, { createContext, useState } from "react"


const baseURL = `http://localhost:8088`

export const ItemContext = createContext()

export const ItemProvider = ( props ) => {

 const [items, setItems] = useState([])

 const getItems = () => {
  return fetch(`${baseURL}/items?_expand=box`)
   .then(res => res.json())
   .then(setItems)
 } // getItems


 return (
  <ItemContext.Provider value={{
   items,
   getItems,
   setItems
  }}>
   { props.children }
  </ItemContext.Provider>
 )
}
