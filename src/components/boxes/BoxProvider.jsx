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


 const deleteBox = ( id ) => {
   return fetch(`${baseURL}/boxes/${id}`, {
     method: "DELETE"
   })
   .then(getBoxes)
 } // deleteBox

 
  const addBoxes = ( box ) => {
   return fetch(`${baseURL}/boxes`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(box)
   })
   .then(getBoxes)
 } // addItem


 return (
  <BoxContext.Provider value={{
   boxes,
   getBoxes,
   setBoxes,
   deleteBox,
   addBoxes
  }}>
   { props.children }
  </BoxContext.Provider>
 )
}
