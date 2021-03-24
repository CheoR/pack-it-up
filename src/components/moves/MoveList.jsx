import React, { useContext, useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "./MoveProvider"
import { MoveSummary } from "./MoveSummary"
import "./moveList.css"
import { Counter } from "../counter/Counter"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 const numList = valueList.map(item => item.value)

 return numList.reduce((acc, curr) => acc + curr, 0)
}

const _getSum2 = ( valueList ) => {

 if(!valueList.length) return 0;

 return valueList.reduce((acc, curr) => acc + curr, 0)
}


export const MoveList = () => {

 const { moves, getMoves, addMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 const newMove = {
   type: {
      "userId": 0,
      "moveName": ""
   },
   addObj: addMoves
 }

 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)
 }, []) // useEffect

  const movesData = moves.filter(move => move.userId === loggedInUserId)
  const boxesData = boxes.filter(box => movesData.find(move => box.moveId === move.id))
  const itemsData = items.filter(item => boxesData.find(box => item.boxId === box.id))
  const loggedInUserObj = moves.find(move => move.userId === loggedInUserId)

   movesData.forEach(move => {
     /*
      For each move
        get the number of boxes associated with the move
        for each box
          get the total number of items in that box
          update the number of total boxes for that move
          get the total value of tims in that box
          updatae the total number of items of rthat move
     */
    /*
    TODO: find a way to make this _getSum generic wtih BoxList _getSum
    TODO: instead of fetching objcts, only fetch ids
    */
    const boxesForThisMove = boxesData.filter(box => box.moveId === move.id)

    move.totalBoxCount = boxesForThisMove.length
    move.totalItemsCount = 0
    move.totalItemsValue = 0

    boxesForThisMove.forEach(box => {
      move.totalItemsCount += itemsData.filter(item => item.boxId === box.id).length
      move.totalItemsValue += _getSum(itemsData.filter(item => item.boxId === box.id ? item.value : 0))
      box.isFragile = itemsData.some(item => item.isFragile ? true : false)
    }) // boxes.forEach

    const anyFragile = boxesForThisMove.map(b => b.isFragile).some(f => f ? f : !f)
    move.isFragile = anyFragile
  }) // moves.forEach


   return (
    <div className="moveSummaryList">
      <h1 className="moveSummaryList__header">{ loggedInUserObj?.user.username }'s Moves</h1>
      {
        movesData.map((move, i) => <MoveSummary key={i} move={ move } />)
      }
      <Counter objType={newMove} />
    </div>
  )
}
