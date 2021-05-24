import React, { createContext, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"


const baseURL = `http://localhost:8088`

export const MoveContext = createContext()

export const MoveProvider = ( props ) => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
 
 const [ moves, setMoves ] = useState([])

 const getMoves = () => {
  return fetch(`${baseURL}/moves?_expand=user`)
   .then(res => res.json())
   .then(setMoves)
 } // getMoves


 const getMovesByUserId = () => {
  return fetch(`${baseURL}/moves?userId=${ loggedInUserId }`)
   .then(res => res.json())
   .then(setMoves)
 } // getMoves


   const addMove = ( move ) => {
    return fetch(`${baseURL}/moves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(move)
    })
    .then(getMovesByUserId)
  } // addMove


   const updateMove = ( move ) => {
     return fetch(`${baseURL}/moves/${ move.id }`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(move)
    })
     .then(getMovesByUserId)
  } // sendMessage


 const deleteMove = ( id ) => {
   return fetch(`${baseURL}/moves/${ id }`, {
     method: "DELETE"
   })
   .then(getMovesByUserId)
 } // deleteItem


 return (
  <MoveContext.Provider value={{
   moves,
   getMoves,
   getMovesByUserId,
   setMoves,
   addMove,
   updateMove,
   deleteMove
  }}>
   { props.children }
  </MoveContext.Provider>
 )
}
