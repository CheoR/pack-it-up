import React, { useContext, useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import { UserContext } from "../users/UserProvider"
import { ItemContext } from "./ItemProvider"
import { ItemSummary } from "./ItemSummary"
import { Counter } from "../counter/Counter"
import "./itemList.css"

export const ItemList = () => {

 const { items, getItems, addItems } = useContext(ItemContext)
 const { users, getUsers } = useContext(UserContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 const newItem = {
   type: {
    userId: loggedInUserId,
    boxId: 1,
    description: "",
    value: 0,
    isFragile: false,
    imagePath: ""
   },
   addObj: addItems
 }

 useEffect(() => {
   getUsers()
   .then(getItems)
 }, []) // useEffect

  const itemsData = items.filter(item => item.userId === loggedInUserId)
  const loggedInUserObj = users.find(user => user.userId === loggedInUserId)
  
  console.table(itemsData)
 
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
      <h1 className="itemSummaryList__header">{ loggedInUserObj?.user.username }'s Items</h1>
      {
        itemsData.map((item, i) => <ItemSummary key={i} item={item} />)
      }
      <Counter objType={newItem}/>
    </div>
  )
}
