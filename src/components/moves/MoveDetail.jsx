import React, { useContext, useEffect } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "./MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import "./moveDetail.css"


const _getSum = ( valueList ) => {
 /*
  Using .reduce on list of objects results with incorrect sum values.
 */

 if(!valueList.length) return 0;

 return valueList.reduce((acc, curr) => acc + curr, 0)
}

export const MoveDetail = () => {

 const { moveId } = useParams()
 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))

 useEffect(() => {
  getMoves()
   .then(getBoxes)
   .then(getItems)
 }, []) // useEffect

 const move = moves.find(move => move.id === parseInt(moveId))
 const userBoxesIds = boxes.filter(box => box.moveId === move.id).map(box => box.id)
 const userItems = items.filter(item => userBoxesIds.includes(item.boxId))

 move.totalValue = _getSum(userItems.map(item => item.value ? item.value : 0))
 move.isFragile = userItems.some(item => item.isFragile)
 move.totalBoxes = userBoxesIds.length



 const handleControlledInputChange = ( event ) => {
  console.log("selection made")
} // handleControlledInputChange

 return (
  <section className="moveDetail">
   <div className="moveDetail__moveName">
    <div>Move</div>
    <div className="moveDetail__moveName--text">{ move.moveName.substring(0, 20) + " . ." }</div>
  </div>
   <div className="moveDetail__value">
    <div>Value</div>
    <div className="moveDetail__value--value">${ move.totalValue ? move.totalValue : "0.00" }</div>
   </div>

    <div className="moveDetail__boxSummary">
      <div className="moveDetail__boxCount">
      <div className="moveDetail__boxCount__count">{ move.totalBoxes}</div>
      <div>Boxes</div>
      </div>

     <Link to={`/boxes`}>
      <button id={`btn--edit-boxes`} className="moveDetail__linkBtn--edit">add/update boxes</button>
     </Link>
   </div>
       <div className="lowerRow">

  <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ move.isFragile ? "X" : ""}</div>
    </div>
     <Link to="/">
      <button id={`btn--delete-${move.id}`} className="move__linkBtn--delete">Delete</button>
     </Link>
    </div>

   {/* <img className="moveDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />




      <label htmlFor="usersMoves">Current Move Assignment</label>
   <select value={box.move.id} id="usersMoves" className="form-control" onChange={handleControlledInputChange}>
      TODO: Need to find a way to have "0" - no selection as an option since user can create items before assigning a box*
     <option value="0">Select a location</option>
     {userMoves.map(move => (
      <option key={move.id} value={move.moveName}>
       {move.moveName}
     </option>
     ))}
   </select>
   
     <Link to={`/moves/${box.moveId}`}>
      <button id={`btn--viewMove`} className="boxDetail__linkBtn--viewMove">view move</button>
     </Link>
 */}
  </section> 
 )
}
