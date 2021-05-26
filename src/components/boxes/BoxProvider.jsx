import React, { createContext, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"

const baseURL = `http://localhost:8088`

export const BoxContext = createContext()

export const BoxProvider = ( props ) => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 const [ boxes, setBoxes ] = useState([])
 

 const getBoxes = () => {
  return fetch(`${baseURL}/boxes?_expand=move`)
   .then(res => res.json())
   .then(setBoxes)
 } // getBoxes


  const getBoxesByUserId = () => {
    console.log("\t\t\t2. getting boxes")
  return fetch(`${baseURL}/boxes?userId=${ loggedInUserId }`)
   .then(res => res.json())
   .then(setBoxes)
  //  .then(() => { return true })
 } // getBoxes


  const addBox = ( box ) => {
   return fetch(`${baseURL}/boxes`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(box)
   })
   .then(getBoxesByUserId)
 } // addItem


   const updateBox = ( box ) => {
     return fetch(`${baseURL}/boxes/${ box.id }`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(box)
    })
     .then(getBoxesByUserId)
  } // updateBox


 const deleteBox = ( id ) => {
   return fetch(`${baseURL}/boxes/${ id }`, {
     method: "DELETE"
   })
   .then(getBoxesByUserId)
 } // deleteBox

 

 return (
  <BoxContext.Provider value={{
   boxes,
   addBox,
   updateBox,
   getBoxes,
   getBoxesByUserId,
   setBoxes,
   deleteBox,
  }}>
   { props.children }
  </BoxContext.Provider>
 )
}
