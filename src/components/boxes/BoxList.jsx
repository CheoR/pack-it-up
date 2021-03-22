import React, { useContext, useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "./BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { BoxSummary } from "./BoxSummary"
import "./boxList.css"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 const numList = valueList.map(item => item.value)

 return numList.reduce((acc, curr) => acc + curr, 0)
}


export const BoxList = () => {

 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))


 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)

 }, []) // useEffect

  const movesData = moves.filter(move => move.userId === loggedInUserId)
  const boxesData = boxes.filter(box => movesData.find(move => box.moveId === move.id))
  const itemsData = items.filter(item => boxesData.find(box => item.boxId === box.id))
  const loggedInUserObj = moves.find(move => move.userId === loggedInUserId)

  boxesData.forEach(box => {
   box.totalCount = itemsData.filter(item => item.boxId === box.id).length
   box.totalValue = _getSum(itemsData.filter(item => item.boxId === box.id ? item.value : 0))
   box.isFragile = itemsData.some(item => item.isFragile ? true : false)
   box.moveName = movesData.find(move => move.id === box.moveId).moveName
  }) // boxes.forEach

   return (
    <div className="boxSummaryList">
      <h1 className="boxSummaryList__header">{ loggedInUserObj?.user.username }'s Boxes</h1>
      {
        boxesData.map((box, i) => <BoxSummary key={i} box={ box } />)
      }
    </div>
  )
}
