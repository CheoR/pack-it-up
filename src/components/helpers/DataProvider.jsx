// import React, { createContext, useContext, useEffect, useState } from "react"
// import { BoxContext } from "../boxes/BoxProvider"
// import { ItemContext } from "../items/ItemProvider"
// import { MoveContext } from "../moves/MoveProvider"
// import { getSum2 } from "./helpers"


// export const DataContext = createContext()
// export const DataProvider = ( props ) => {

//  const [ data, setData ] = useState({})

//  const getUserData = () => {

//   const { moves, getMovesByUserId, addMove } = useContext(MoveContext)
//   const { boxes, getBoxesByUserId } = useContext(BoxContext)
//   const { items, getItemsByUserId } = useContext(ItemContext)

//   // useEffect(() => {
//    console.log("in data rovider use effect" )
//    getMovesByUserId()
//     .then(getBoxesByUserId)
//     .then(getItemsByUserId)
//     .then(aggregateMoveInfo)
//   // }, [ ] ) // useEffect
 
//   const aggregateMoveInfo = () => {
//    moves.forEach(move => {
//     /*
//      Aggregate box/item information per move.
//     */
//     const boxesForThisMove = boxes.filter(box => box.moveId === move.id)
  
//     move.totalBoxCount = boxesForThisMove.length
//     move.totalItemsCount = 0
//     move.totalItemsValue = 0
  
//     boxesForThisMove.forEach(box => {
//       const itemsInBox = items.filter(item => item.boxId === box.id)
  
//       move.totalItemsCount += itemsInBox.length
//       move.totalItemsValue += getSum2(itemsInBox.filter(item => item.value ? item.value : 0))
//       box.isFragile = itemsInBox.some(item => item.isFragile ? true : false)
//     }) // boxesForThisMove.forEach
  
//     /*
//       Mark move fragile if any of its boxes are marked fragile.
//       Boxes are marked fragile if any of its items are marked fragile.
//     */
//     move.isFragile = boxesForThisMove.some(b => b.isFragile)

//    }) // moves
 
//    setData({
//     type: {
//      moves: moves,
//      boxes: boxes,
//      items: items
//     },
//     add: {
//      moves: addMove
//     }
//    })
//   } // aggregateMoveInfo

//  } // getUserData

//  return (
//   <DataContext.Provider value={{
//    data,
//    getUserData
//   }}>
//    { props.children}
//   </DataContext.Provider>
//  )
// }