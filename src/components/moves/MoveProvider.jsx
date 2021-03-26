import React, { createContext, useState } from "react"


const baseURL = `http://localhost:8088`

export const MoveContext = createContext()

export const MoveProvider = ( props ) => {
 
 const [moves, setMoves] = useState([])

 const getMoves = () => {
  return fetch(`${baseURL}/moves?_expand=user`)
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
    .then(getMoves)
  } // addMove


   const updateMove = ( move ) => {
     return fetch(`${baseURL}/moves/${move.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(move)
    })
     .then(getMoves)
  } // sendMessage


 const deleteMove = ( id ) => {
   return fetch(`${baseURL}/moves/${id}`, {
     method: "DELETE"
   })
   .then(getMoves)
 } // deleteItem


 return (
  <MoveContext.Provider value={{
   moves,
   getMoves,
   setMoves,
   addMove,
   updateMove,
   deleteMove
  }}>
   { props.children }
  </MoveContext.Provider>
 )
}
