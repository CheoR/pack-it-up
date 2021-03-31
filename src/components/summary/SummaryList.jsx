import React, { useContext, useEffect } from "react"

import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { Summary } from "./Summary"
import "./summaryList.css"
import { Instructions } from "../helpers/instructions/Instructions"


export const SummaryList = () => {

 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)

const loggedInUserId = parseInt(sessionStorage.getItem("app_user_id"))
const loggedInUser = sessionStorage.getItem("app_user_username")

 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)
 }, []) // useEffect

 
  const usersMoves = {
    type: "moves",
    canUse: false,
    collection: moves.filter(move => move.userId === loggedInUserId)
  }

  const usersBoxes = {
    type: "boxes",
    canUse: usersMoves.collection.length ? false : true,
    collection: boxes.filter(box => box.userId === loggedInUserId)
  }

  const usersItems = {
    type: "items",
    canUse: usersBoxes.collection.length ? false : true,
    collection: items.filter(item => item.userId === loggedInUserId)
  }
  
  const dataToRender = [usersMoves, usersBoxes, usersItems]

  return (
    <div className="summaryList">
      <h1 className="summaryList__header">{ loggedInUser }'s Summary</h1>
      <Instructions />
      {
        dataToRender.map((data, i) => <Summary key={i} listType={{ data }} />)
      }
    </div>
  )
}
