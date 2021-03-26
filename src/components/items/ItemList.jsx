import React, { useContext, useEffect, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { ItemContext } from "./ItemProvider"
import { ItemSummary } from "./ItemSummary"
import { Counter } from "../counter/Counter"
import "./itemList.css"

export const ItemList = () => {

 const { items, getItems, addItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
 const loggedInUserName = sessionStorage.getItem(userStorageUserName)

 const newItem = {
   type: {
    userId: loggedInUserId,
    boxId: 1,
    description: "Change Item Description",
    value: 0,
    isFragile: false,
    imagePath: ""
   },
   addObj: addItems
 }

 useEffect(() => {
   getItems()
 }, []) // useEffect

  const itemsData = items.filter(item => item.userId === loggedInUserId)
   
  itemsData.forEach(item => {
   /*
    item.hasAssociatedBox = item.boxId ? true : false
    item.hasAssociatedMove = item?.box.moveId ? true : false
    Neat way to turn number into a boolean
   */
   item.hasAssociatedBox = !!item.boxId
   item.hasAssociatedMove = !!item?.box?.moveId
  })

   return (
    <div className="itemSummaryList">
      <h1 className="itemSummaryList__header">{ loggedInUserName }'s Items</h1>
      {
        itemsData.map((item, i) => <ItemSummary key={i} item={item} />)
      }
      <Counter objType={newItem}/>
    </div>
  )
}
