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


  const addBox = ( box ) => {
   return fetch(`${baseURL}/boxes`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(box)
   })
   .then(getBoxes)
 } // addItem


   const updateBox = ( box ) => {
     return fetch(`${baseURL}/boxes/${box.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(box)
    })
     .then(getBoxes)
  } // updateBox


 const deleteBox = ( id ) => {
   return fetch(`${baseURL}/boxes/${id}`, {
     method: "DELETE"
   })
   .then(getBoxes)
 } // deleteBox

 

 return (
  <BoxContext.Provider value={{
   boxes,
   addBox,
   updateBox,
   getBoxes,
   setBoxes,
   deleteBox,
  }}>
   { props.children }
  </BoxContext.Provider>
 )
}
