
import { useContext, useEffect, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { getSum2 } from "./helpers"

import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"

export const useFilteredData = ( ) => {
 // custom hook
 // const [ value, setValue ] = useState(null)

 // let userFilterRendercount = 1

 // console.log(`\tuserFilterRendercount: ${userFilterRendercount}`)
 // userFilterRendercount = userFilterRendercount + 1

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

  const { moves, setMoves, getMovesByUserId, addMove } = useContext(MoveContext)
  const { boxes, setBoxes, getBoxesByUserId } = useContext(BoxContext)
  const { items, setItems, getItemsByUserId } = useContext(ItemContext)

  console.log(" I AM USER FILTER DATA FILE ")
 
  useEffect(() => {
   console.log("NEVER GET CALLED calling getby userid in use effect")
   getMovesByUserId()
    .then(getBoxesByUserId)
    .then(getItemsByUserId)
    .then(aggregateMoveInfo)
  }, [ ] ) // useEffect
 
  const aggregateMoveInfo = () => {
   moves.forEach(move => {
    /*
     Aggregate box/item information per move.
    */
    const boxesForThisMove = boxes.filter(box => box.moveId === move.id)
  
    move.totalBoxCount = boxesForThisMove.length
    move.totalItemsCount = 0
    move.totalItemsValue = 0
  
    boxesForThisMove.forEach(box => {
      const itemsInBox = items.filter(item => item.boxId === box.id)
  
      move.totalItemsCount += itemsInBox.length
      move.totalItemsValue += getSum2(itemsInBox.filter(item => item.value ? item.value : 0))
      box.isFragile = itemsInBox.some(item => item.isFragile ? true : false)
    }) // boxesForThisMove.forEach
  
    /*
      Mark move fragile if any of its boxes are marked fragile.
      Boxes are marked fragile if any of its items are marked fragile.
    */
    move.isFragile = boxesForThisMove.some(b => b.isFragile)

   }) // moves
 
   setMoves(moves)
  } // aggregateMoveInfo
 
 
 // return [ value, setValue ]
 return { moves, boxes, items, addMove }
}