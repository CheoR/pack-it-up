import React, { useContext, useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"
import { ItemSummary } from "./ItemSummary"
import "./itemList.css"
import { Counter } from "../counter/Counter"

export const ItemList = () => {

 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems, addItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 const payload = {
   type: {
    boxId: 0,
    description: "",
    value: 0,
    isFragile: false,
    imagePath: "'"
   },
   callAdd: addItems
 }

 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)
 }, []) // useEffect
 

  const movesData = moves.filter(move => move.userId === loggedInUserId)
  const boxesData = boxes.filter(box => movesData.find(move => box.moveId === move.id))
  const itemsData = items.filter(item => boxesData.find(box => item.boxId === box.id))


  itemsData.forEach(item => {
   /*
    Make it easier for presentation template,
    add properties that shows if item has a box/move assigned since
    items/boxes can be delinked from boxes/moves, respectivly.

    item.hasAssociatedBox = item.boxId ? true : false
    item.hasAssociatedMove = item?.box.moveId ? true : false
    Neat way to turn number into a boolean
   */
   item.hasAssociatedBox = !!item.boxId
   item.hasAssociatedMove = !!item?.box.moveId
  })

  const loggedInUserObj = moves.find(move => move.userId === loggedInUserId)
// console.log(loggedInUserObj)
   return (
    <div className="itemSummaryList">
      <h1 className="itemSummaryList__header">{ loggedInUserObj?.user.username }'s Items</h1>
      {
        itemsData.map((item, i) => <ItemSummary key={i} item={item} />)
      }
      <Counter createType={payload}/>
    </div>
  )
}
