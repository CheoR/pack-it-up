import React, { useContext, useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import { UserContext } from "../users/UserProvider"
import { BoxContext } from "./BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { BoxSummary } from "./BoxSummary"
import { Counter } from "../counter/Counter"
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

 const { boxes, getBoxes, addBoxes } = useContext(BoxContext)
 const { users, getUsers } = useContext(UserContext)
 const { items, getItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))


 const newBox = {
   type: {
    "userId": loggedInUserId,
    "moveId": 1,
    "location": "Change Box Location",
    "qrCode": ""
   },
   addObj: addBoxes
 }
 
 useEffect(() => {
   getUsers()
    .then(getBoxes)
    .then(getItems)
 }, []) // useEffect

  const boxesData = boxes.filter(box => box.userId === loggedInUserId)
  const itemsData = items.filter(item => boxesData.find(box => item.boxId === box.id))
  const loggedInUserObj = users.find(user => user.userId === loggedInUserId)

  boxesData.forEach(box => {
   box.totalCount = itemsData.filter(item => item.boxId === box.id).length
   box.totalValue = _getSum(itemsData.filter(item => item.boxId === box.id ? item.value : 0))
   box.isFragile = itemsData.some(item => item.isFragile ? true : false)
   box.moveName = box?.move?.moveName// movesData.find(move => move.id === box.moveId).moveName
  }) // boxes.forEach


   return (
    <div className="boxSummaryList">
      <h1 className="boxSummaryList__header">{ loggedInUserObj?.user.username }'s Boxes</h1>
      {
        boxesData.map((box, i) => <BoxSummary key={i} box={ box } />)
      }
      <Counter objType={newBox} />
    </div>
  )
}
