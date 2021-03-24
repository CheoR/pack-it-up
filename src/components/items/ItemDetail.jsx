import React, { useContext, useEffect } from "react"
import { Redirect, useHistory, useParams } from "react-router"
import { Link } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"
import "./itemDetail.css"


export const ItemDetail = () => {

 const { itemId } = useParams()
 const { moves, getMoves } = useContext(MoveContext)
 const { boxes, getBoxes } = useContext(BoxContext)
 const { items, getItems, deleteItem } = useContext(ItemContext)
 const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
 const history = useHistory()

 useEffect(() => {
  getMoves()
   .then(getBoxes)
   .then(getItems)
 }, []) // useEffect

 const item = items.find(item => item.id === parseInt(itemId))
 const userMovesIds = moves.filter(move => move.userId === loggedInUserId).map(move => move.id)
 const userBoxes = boxes.filter(box => userMovesIds.includes(box.moveId)).map(box => { return {id: box.id, location: box.location} })
//  const handleDelete = ( id ) => deleteItem(id).then(() => history.push("/items"))
 
  const handleDelete = () => deleteItem(item.id).then(() => history.push("/items"))


 const handleControlledInputChange = ( event ) => {
  console.log("selection made")
  /*
    Make copy of current state.
    Modify.
    Call update state on new copy.
  */
  // const newAnimal =  { ...animal }

  /*
    Shorthand for updating the property that the user changed through
    the input field for that property.
    e.g. User updates animal adddress, updated object would be
    newAddress["address"] = "new address"
  */
 // newAnimal[event.target.id] = event.target.value
 // if(event.target.id.includes("Id")) {
 //   newAnimal[event.target.id] = parseInt(event.target.value)
 // }
 // setAnimal(newAnimal)
} // handleControlledInputChange

 return (
  /*
   TODO: change this into a form so user can update form fields and use useState
  */
  <section className="itemDetail">
   <img className="itemDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
   <div className="itemDetail__description">
     <div>Description</div>
     <div className="itemDetail__description--text">{ item?.description.substring(0, 20) + " . ." }</div>
    </div>
   <div className="itemDetail__value">
    <div>Value</div>
    <div className="itemDetail__value--value">${ item?.value ? item?.value : "0.00" }</div>
   </div>
   <label htmlFor="usersBoxes">Current Box Assignment</label>
   <select value={item.boxId} id="usersBoxes" className="form-control" onChange={handleControlledInputChange}>
     {/* TODO: Need to find a way to have "0" - no selection as an option since user can create items before assigning a box*/}
     {/* <option value="0">Select a location</option> */}
     {userBoxes.map(box => (
      <option key={box.id} value={box.location}>
       {box.location}
     </option>
     ))}
   </select>

     <Link to={`/boxes/${item.boxId}`}>
      <button id={`btn--edit-${item.boxId}`} className="item__linkBtn--viewBox">View Box Assgined</button>
     </Link>
   
  
    <div className="lowerRow">

    <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ item.isFragile ? "X" : ""}</div>
    </div>
      <button id="camera" className="item__linkBtn--camera">Camera</button>
      {/* <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={() => handleDelete(item.id)}>Delete</button> */}
      <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={handleDelete}>Delete</button>
    </div> 
  </section>
 )
}
