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
   deleteMove
  }}>
   { props.children }
  </MoveContext.Provider>
 )
}
