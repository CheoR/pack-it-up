import React, { useContext, useEffect } from "react"

import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { Summary } from "./Summary"
import "./summaryList.css"


export const SummaryList = ({ loggedInUserId }) => {

 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)

 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)
 }, []) // useEffect

 
  const movesData = {
    type: "moves",
    collection: moves.filter(move => move.userId === loggedInUserId)
  }

  const boxesData = {
    type: "boxes",
    collection: boxes.filter(box => movesData.collection.find(move => box.moveId === move.id))
  }

  const itemsData = {
    type: "items",
    collection: items.filter(item => boxesData.collection.find(box => item.boxId === box.id))
  }
  
  const loggedInUser= moves.find(move => move.userId === loggedInUserId)
  const dataToRender = [movesData, boxesData, itemsData]

  return (
    <div className="summaryList">
      <h1 className="summaryList__header">{ loggedInUser?.user.username }'s Summary</h1>
      {
        dataToRender.map((data, i) => <Summary key={i} listType={{ data }} />)
      }
    </div>
  )
}
