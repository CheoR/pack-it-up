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


  const addMoves = ( move ) => {
   return fetch(`${baseURL}/moves`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(move)
   })
   .then(getMoves)
 } // addMove


 return (
  <MoveContext.Provider value={{
   moves,
   getMoves,
   setMoves,
   addMoves
  }}>
   { props.children }
  </MoveContext.Provider>
 )
}
