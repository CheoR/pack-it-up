import React, { useContext, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Link } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "./BoxProvider"
import "./boxDetail.css"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 return valueList.reduce((acc, curr) => acc + curr, 0)
}

export const BoxDetail = () => {

 const { boxId } = useParams()
 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes, deleteBox } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 useEffect(() => {
  getMoves()
   .then(getBoxes)
   .then(getItems)
 }, []) // useEffect

 const box = boxes.find(box => box.id === parseInt(boxId))
 const userMoves = moves.filter(move => move.userId === loggedInUserId)
 const userItems = items.filter(item => item.boxId === box.id)
 box.totalItems = userItems.length
 box.totalValue = _getSum(userItems.map(item => item.value ? item.value : 0))
 box.isFragile = items.some(item => item.isFragile)

 const history = useHistory()
 const handleDelete = () => deleteBox(box.id).then(() => history.push("/users"))

 const handleControlledInputChange = ( event ) => {
  console.log("selection made")
} // handleControlledInputChange

 return (
  <section className="boxDetail">
   <img className="boxDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
  <div className="boxDetail__location">
    <div>Location</div>
    <div className="boxDetail__location--text">{ box.location.substring(0, 20) + " . ." }</div>
  </div>
  <div className="boxDetail__value">
    <div>Value</div>
    <div className="boxDetail__value--value">${ box.totalValue ? box.totalValue : "0.00" }</div>
   </div>
   <div className="boxDetail__itemSummary">
    <div className="boxDetail__itemCount">
     <div className="boxDetail__itemCount__count">{ box.totalItems }</div>
     <div>Items</div>
    </div>

     <Link to={`/items`}>
      <button id={`btn--edit-items`} className="boxDetail__linkBtn--edit">add/update items</button>
     </Link>
   </div>

      <label htmlFor="usersMoves">Current Move Assignment</label>
   <select value={box.move.id} id="usersMoves" className="form-control" onChange={handleControlledInputChange}>
     {/* TODO: Need to find a way to have "0" - no selection as an option since user can create items before assigning a box*/}
     {/* <option value="0">Select a location</option> */}
     {userMoves.map(move => (
      <option key={move.id} value={move.moveName}>
       {move.moveName}
     </option>
     ))}
   </select>
   
     <Link to={`/moves/${box.moveId}`}>
      <button id={`btn--viewMove`} className="boxDetail__linkBtn--viewMove">view move</button>
     </Link>
    <div className="lowerRow">

  <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ box.isFragile ? "X" : ""}</div>
    </div>
     {/* <Link to="/">
      <button id={`btn--delete-${box.id}`} className="box__linkBtn--delete">Delete</button>
     </Link> */}
     <button id={`btn--delete-${box.id}`} className="box__linkBtn--delete" onClick={handleDelete}>Delete</button>
    </div> 
  </section>
 )
}
