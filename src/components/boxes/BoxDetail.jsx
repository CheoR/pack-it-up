import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { Link, NavLink } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { ItemContext } from "../items/ItemProvider"
import { MoveContext } from "../moves/MoveProvider"
import { BoxContext } from "./BoxProvider"
import { getSum3 } from "../helpers/helpers"
import styles from "./boxDetail.module.css"



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
     ? 
     <section className={styles.container}>
       <img className={styles.container__image} src={`https://source.unsplash.com/featured/?${box.location}`} alt={`${box.location}`} />
       <form action="" className={styles.container__form}>
         <fieldset className={styles.container__formGroup}>
          <label className={styles.locationLable} htmlFor="location">Location: </label>
          <input 
          type="text" 
          id="location" 
          name="location"
          className={styles.formControl} 
          placeholder="Add Box Location ..."
          value={formField.location}
          onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
          <div className={styles.container__value}>Value</div>
          <div className={styles.container__value__value}>${ box.totalValue ? box.totalValue : "0.00" }</div>

          <label className={styles.container__dropdownLabel} htmlFor="usersMoves">Current Move Assignment</label>
          <select value={userMoves[0]?.id} id="usersMoves" className={styles.formControl} onChange={handleControlledDropDownChange}>
            <option value="0">Select a location</option>
              {userMoves.map(move => (
            <option boxid={move.id} key={move.id} value={move.moveName}>
              {move.moveName}
            </option>
            ))}
          </select>
        </fieldset>

        <div className={styles.container__itemCount}>
          <div className={styles.container__itemCount__count}>{ box?.totalItems }</div>
          <div>Items</div>
        </div> {/* container__itemCount */}
        <NavLink to={
          {
          pathname: "/items",
            state: {
              box: parseInt(boxId)
            }
          }} className={styles.container__navlink}>
          <button id={`btn--edit-items`} className={styles.container__navlinkBtn}>add/update items</button>
        </NavLink>
         <NavLink to={`/moves/${box?.moveId}`} className={styles.container__navlink__view}>
          <button id={`btn--viewMove`} className={styles.container__navlinkBtn__view}>view move</button>
        </NavLink>

        <fieldset className={styles.fragile__checkbox}>
          <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile</label>
          <input type="checkbox" id="isFragile" checked={box?.isFragile}  className={styles.formControl} />
        </fieldset>

        <button className={styles.container__btn__submit} type="submit" onClick={submitUpdate}>Update</button>
        <button id={`btn--delete-${box?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>

       </form>
     </section>
     : <> Loading ... </>
  }

 </>)
}

{/* <form action="" className="boxDetail__form">

       
    <div className="lowerRow">
      <div className="fragile">
        <div>Fragile</div>
        <div className="checkBox">{ box?.isFragile ? "X" : ""}</div>
      </div>
      <button className="btn__submit" type="submit" onClick={submitUpdate}>Update</button>
      <button id={`btn--delete-${box?.id}`} className="box__linkBtn__delete" onClick={handleDelete}>Delete</button>
    </div>
     </form> */}