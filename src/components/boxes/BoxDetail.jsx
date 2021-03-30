import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { Link } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "./BoxProvider"
import { getSum3 } from "../helpers/helpers"
import "./boxDetail.css"



export const BoxDetail = () => {

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const { moves, getMoves } = useContext(MoveContext)
  const { boxes, getBoxes, updateBox, deleteBox } = useContext(BoxContext)
  const { items, getItems } = useContext(ItemContext)
  const [ formField, setFormField ] = useState({
    "userId": loggedInUserId,
    "moveId": 0,
    "location": "",
    "qrCode": ""
  })

  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ hasSaved, setHasSaved ] = useState(false)
  // const [ newBox, setNewBox ] = useState({})
  const { boxId } = useParams()

 useEffect(() => {
  getMoves()
   .then(getBoxes)
   .then(getItems)
   .then(() => setIsLoaded(true))
 }, []) // useEffect

 
 useEffect(() => {
  if(isLoaded && boxes) {
    const box = boxes.find(box => box.id === parseInt(boxId))
    setFormField({
        "id": box.id,
        "userId": loggedInUserId,
        "moveId": box.moveId,
        "location": "Change Box Location",
        "qrCode": ""
      })
  } // if

  if(hasSaved) {
    window.alert("Updated")
  }
 }, [isLoaded])

 const box = boxes.find(box => box?.id === parseInt(boxId))
 const userMoves = moves.filter(move => move?.userId === loggedInUserId)
 const userItems = items.filter(item => item?.boxId === box?.id)

 if(box){
   box.totalItems = userItems?.length
   box.totalValue = getSum3(userItems.map(item => item?.value ? item?.value : 0))
   box.isFragile = items.some(item => item?.isFragile)
 }

 const history = useHistory()
 const handleDelete = () => deleteBox(box?.id).then(() => history.push("/boxes"))

 const handleControlledDropDownChange = ( event ) => {
  const newformField = { ...formField }
  newformField[event.target.id] = event.target.value

  const selectedIndex = parseInt(event.target.options.selectedIndex)
  const optionId = event.target.options[selectedIndex].getAttribute('boxid')

  newformField.moveId = parseInt(optionId)
  setFormField(newformField)
  setHasSaved(false)
} // handleControlledInputChange

  const handleControlledInputChange = ( event ) => {
    const newformField = { ...formField }
    newformField[event.target.id] = event.target.value
    setFormField(newformField)
    setHasSaved(false)
} // handleControlledInputChange

const submitUpdate = (event) => {
  event.preventDefault()
  const newformField = { ...formField }

  /*
    Cleanup. Does not belong to ERD.
  */
  delete newformField.usersMoves
  updateBox(newformField)
    setHasSaved(true)
} // updateMove

 return (<>
   {
     isLoaded
     ?<form action="" className="boxDetail__form">
       <img className="boxDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
       <fieldset className="form-group">
          <label className="locationLable" htmlFor="location">Location: </label>
          <input 
          type="text" 
          id="location" 
          name="location"
          className="form-control" 
          placeholder="Add Box Location ..."
          value={formField.location}
          onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
        </fieldset>
        <div className="boxDetail__value">
          <div>Value</div>
          <div className="boxDetail__value--value">${ box.totalValue ? box.totalValue : "0.00" }</div>
        </div> {/* boxDetail__value */}
        <div className="boxDetail__summary">
          <div className="boxDetail__itemCount">
            <div className="boxDetail__itemCount__count">{ box?.totalItems }</div>
            <div>Items</div>
          </div>
          <Link to={
            {
              pathname: "/items",
              state: {
                box: parseInt(boxId)
              }
            }
          }>
            <button id={`btn--edit-items`} className="boxDetail__linkBtn--edit">add/update items</button>
          </Link>
        </div> {/* boxDetail__itemSummary */}
        <label htmlFor="usersMoves">Update Move Assignment</label>
      <select value={userMoves[0]?.id} id="usersMoves" className="form-control" onChange={handleControlledDropDownChange}>
        <option value="0">Select a location</option>
            {userMoves.map(move => (
            <option boxid={move.id} key={move.id} value={move.moveName}>
              {move.moveName}
            </option>
            ))}
        </select>
        <Link to={`/moves/${box?.moveId}`}>
          <button id={`btn--viewMove`} className="boxDetail__linkBtn--viewMove">view move</button>
        </Link>
    <div className="lowerRow">
      <div className="fragile">
        <p>Fragile</p>
        <div className="checkBox">{ box?.isFragile ? "X" : ""}</div>
      </div>
      <button className="btn--submit-boxes" type="submit" onClick={submitUpdate}>Update</button>
      <button id={`btn--delete-${box?.id}`} className="box__linkBtn--delete" onClick={handleDelete}>Delete</button>
    </div> {/* lowerRow */}
     </form>
     : <> Loading ... </>
  }

 </>)
}