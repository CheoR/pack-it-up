import React, { createContext, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"

const baseURL = `http://localhost:8088`

export const ItemContext = createContext()

export const ItemProvider = ( props ) => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 const [ items, setItems ] = useState([])


 const getItems = () => {
  return fetch(`${baseURL}/items?_expand=box`)
   .then(res => res.json())
   .then(setItems)
 } // getItems


 const getItemsByUserId = () => {
   console.log("\t\t\t3. getting items")
  return fetch(`${baseURL}/items?userId=${ loggedInUserId }`)
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
   .then(getItemsByUserId)
 } // addItem


   const updateItem = ( item ) => {
     return fetch(`${baseURL}/items/${ item.id }`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    })
     .then(getItemsByUserId)
  } // updateItem


 const deleteItem = ( id ) => {
   return fetch(`${baseURL}/items/${ id }`, {
     method: "DELETE"
   })
   .then(getItemsByUserId)
 } // deleteItem


 const uploadItemImage = ( formData ) => {
    return fetch('https://api.Cloudinary.com/v1_1/cheor/image/upload', {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(res => res)

 } // postImage


 return (
  <ItemContext.Provider value={{
   items,
   getItems,
   getItemsByUserId,
   setItems,
   addItem,
   updateItem,
   deleteItem,
   uploadItemImage
  }}>
   { props.children }
  </ItemContext.Provider>
 )
}
