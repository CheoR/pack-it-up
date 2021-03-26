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

 const addItem = ( item ) => {
   return fetch(`${baseURL}/items`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(item)
   })
   .then(getItems)
 } // addItem


   const updateItem = ( item ) => {
     return fetch(`${baseURL}/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    })
     .then(getItems)
  } // updateItem


 const deleteItem = ( id ) => {
   return fetch(`${baseURL}/items/${id}`, {
     method: "DELETE"
   })
   .then(getItems)
 } // deleteItem


 return (
  <ItemContext.Provider value={{
   items,
   getItems,
   setItems,
   addItem,
   updateItem,
   deleteItem
  }}>
   { props.children }
  </ItemContext.Provider>
 )
}
