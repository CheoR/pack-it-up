import React, { useContext, useEffect, useState } from "react"

import { userStorageKey, userStorageUserName } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "./MoveProvider"
import { MoveSummary } from "./MoveSummary"
import { getSum2 } from "../helpers/helpers"
import { Counter } from "../counter/Counter"
import styles from "./moveList.module.css"


export const MoveList = () => {
  /*
    Todo: refactor code below.
  */

 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
 const loggedInUserName = sessionStorage.getItem(userStorageUserName)
 const { moves, setMoves, getMoves, addMove } = useContext(MoveContext)
 const { boxes, setBoxes, getBoxes } = useContext(BoxContext)
 const { items, setItems, getItems } = useContext(ItemContext)
 const [ formField, setFormField ] = useState({})
 const [ isLoaded, setIsLoaded ] = useState(false)


 useEffect(() => {
  getMoves()
    .then(getBoxes)
    .then(getItems)
    .then(() => setIsLoaded(true))
 }, []) // useEffect


 useEffect(() => {

  setFormField({
    type: {
      "userId": loggedInUserId,
      "moveName": "New Move"
    },
    addObj: addMove
  }) // setFormField


  const [movesData, boxesData, itemsData] = [moves, boxes, items].map(type => type.filter(obj => obj.userId === loggedInUserId))
  setMoves(movesData)
  setBoxes(boxesData)
  setItems(itemsData)

 }, [isLoaded]) // useEffect


  const handleControlledInputChange = ( event ) =>  {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const newformField = { ...formField }
    newformField.type[event.target.id] = event.target.value
    setFormField(newformField)
  } // handleControlledInputChange


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
    }) // boxes.forEach

    /*
      Mark move fragile if any of its boxes are marked fragile.
      Boxes are marked fragile if any of its items are marked fragile.
    */
    move.isFragile = boxesForThisMove.some(b => b.isFragile)
  }) // moves.forEach


   return (<>
     {
       isLoaded
       ?
       <div className="moveSummaryList">
      <h1 className="moveSummaryList__header">{loggedInUserName}'s Moves</h1>
      {
        moves.map((move, i) => <MoveSummary key={i} move={ move } />)
      }
      <form action="" className="moveSummaryList__form">
        <fieldset className="form-group">
          <label htmlFor="moveName">Move Name: </label>
          <input 
          type="text" 
          id="moveName" 
          name="moveName"
          className="form-control" 
          placeholder="Add Move Name..."
          value={formField.type.moveName}
          onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
        </fieldset>
      </form>
      <Counter objType={formField} />
    </div>
       : <>Loading</>
     }
  </>)
}
