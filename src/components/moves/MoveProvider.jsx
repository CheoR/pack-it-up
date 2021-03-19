import React, { createContext, useState } from "react"


const baseUrl = `http://localhost:8088`

export const MoveContext = createContext()

export const MoveProvider = ( props ) => {
 
 const [moves, setMoves] = useState([])

 const getMoves = () => {
  return fetch(`${baseUrl}/moves?_expand=user`)
   .then(res => res.json())
   .then(setMoves)
 } // getMoves


 return (
  <MoveContext.Provider value={{
   moves,
   getMoves,
   setMoves
  }}>
   { props.children }
  </MoveContext.Provider>
 )
}
