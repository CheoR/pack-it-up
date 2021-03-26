import React, { useContext, useEffect, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { ItemContext } from "./ItemProvider"
import { ItemSummary } from "./ItemSummary"
import { Counter } from "../counter/Counter"
import "./itemList.css"
import { BoxContext } from "../boxes/BoxProvider"

export const ItemList = () => {

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const loggedInUserName = sessionStorage.getItem(userStorageUserName)
  const { items, getItems, addItem, updateItem } = useContext(ItemContext)
  const { boxes, setBoxes, getBoxes } = useContext(BoxContext)
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ newItem, setNewItem ] = useState({
   type: {
    userId: loggedInUserId,
    boxId: 0,
    description: "Change Item Description",
    value: 0,
    isFragile: false,
    imagePath: ""
   },
   addObj: addItem
 })


//  const newItem = {
//    type: {
//     userId: loggedInUserId,
//     boxId: 0,
//     description: "Change Item Description",
//     value: 0,
//     isFragile: false,
//     imagePath: ""
//    },
//    addObj: addItem
//  }

 useEffect(() => {
   getBoxes()
    .then(getItems)
    .then(() => setIsLoaded(true))
 }, []) // useEffect

 useEffect(() => {
  if(isLoaded) {
    console.log("all things loaded")
    setNewItem({
      type: {
        userId: loggedInUserId,
        boxId: 0,
        description: "Change Item Description",
        value: 0,
        isFragile: false,
        imagePath: ""
      },
      addObj: addItem
    }) // setNewItem

   const userBoxes = boxes.filter(box => box.userId === loggedInUserId)
   setBoxes(userBoxes)
  } // if

 }, [isLoaded])

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

    const handleControlledInputDropdownChange = ( event ) => {
    /*
      boxid - boxid, not option value.
    */    
    const selectedIndex = parseInt(event.target.options.selectedIndex)
    const optionId = event.target.options[selectedIndex].getAttribute('boxid')
    const updateItem = { ...newItem}
    updateItem.type.boxId = parseInt(optionId)
    // console.log("debug here")
    // console.table(updateItem)
    // debugger
    setNewItem(updateItem)
  } // handleControlledInputDropdownChange


   return (<>
   { isLoaded
    ? <>
      <div className="itemSummaryList">
        <h1 className="itemSummaryList__header">{ loggedInUserName }'s Items</h1>
        {
          itemsData.map((item, i) => <ItemSummary key={i} item={item} />)
        }
        <label className="usersBoxesLabel" htmlFor="usersBoxes">Put into Box for </label>

      <select value={boxes[0]?.id} id="usersBoxes" className="form-control" onChange={handleControlledInputDropdownChange}>
        <option value="0">Select a box</option>
        {
          boxes.map(box => (
            <option boxid={box.id} key={box.id} value={box.location}>{box.location}</option>
          ))
        }
      </select>

        <Counter objType={newItem}/>
      </div> 
    </>
    : <> Loading  .. . </>
   }
  </>)
}

    // <div className="itemSummaryList">
    //   <h1 className="itemSummaryList__header">{ loggedInUserName }'s Items</h1>
    //   {
    //     itemsData.map((item, i) => <ItemSummary key={i} item={item} />)
    //   }
    //   <Counter objType={newItem}/>
    // </div>