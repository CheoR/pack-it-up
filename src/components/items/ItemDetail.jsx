import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"
import "./itemDetail.css"


export const ItemDetail = () => {

  const { boxes, getBoxes, setBoxes } = useContext(BoxContext)
  const { items, getItems, updateItem, deleteItem } = useContext(ItemContext)
  
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ hasSaved, setHasSaved ] = useState(false)
  const [ item, setItem ] = useState({})
  const [ formField, setFormField ] = useState({
  "userId": loggedInUserId,
  "boxId": 0,
  "description": "",
  "value": 0,
  "isFragile": true,
  "imagePath": "",
})

  const history = useHistory()
  const { itemId } = useParams()


 useEffect(() => {
  getBoxes()
   .then(getItems)
   .then(() => setIsLoaded(true))
 }, []) // useEffect


 useEffect(() => {
   /*
    To display boxes/items assoicated with user.
   */
  if(isLoaded && boxes) {
    const item = items.find(item => item.id === parseInt(itemId))
    setBoxes(boxes.filter(box => box.userId === loggedInUserId))
    setItem(items.find(item => item.id === parseInt(itemId)))
    setFormField({
        "id": item.id,
        "userId": loggedInUserId,
        "boxId": item.boxId,
        "description": item.description,
        "value": item.value,
        "isFragile": item.isFragile,
        "imagePath": item.imagePath
      })
  } // if
    if(hasSaved) {
    window.alert("Updated")
  }
 }, [items, isLoaded])


 const handleDelete = () => deleteItem(item?.id).then(() => history.push("/items"))
//  const handleControlledInputChange = ( event ) => console.log("selection made")
 
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
  // delete newformField.usersMoves
  updateItem(newformField)
    setHasSaved(true)
} // updateMove


 const handleControlledDropDownChange = ( event ) => {
    const newformField = { ...formField }
  newformField[event.target.id] = event.target.value

    const selectedIndex = parseInt(event.target.options.selectedIndex)
    const optionId = event.target.options[selectedIndex].getAttribute('boxid')

    newformField.moveId = parseInt(optionId)
  setFormField(newformField)
  setHasSaved(false)
 }
 return (<>
    {
      /*
      TODO: change this into a form so user can update form fields and use useState
      */
      isLoaded
      ? <form action="" className="itemDetail__form">
          <img className="boxDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
          <div className="itemDetail__description">
            <div>Description</div>
            <div className="itemDetail__description--text">{ item?.description?.substring(0, 20) + " . ." }</div>
          </div>
          <fieldset className="form-group">
            <label className="descriptionLabel" htmlFor="location">Description: </label>
            <input 
            type="text" 
            id="description" 
            name="description"
            className="form-control" 
            placeholder="Add Item Description ..."
            value={formField.description}
            onChange={(e) => {handleControlledInputChange(e)}}
            autoFocus />

          <label className="valueLabel" htmlFor="location">Value: </label>
          <input 
          type="text" 
          id="value" 
          name="value"
          className="form-control" 
          placeholder="Add Item value ..."
          value={formField.value}
          onChange={(e) => {handleControlledInputChange(e)}}
          autoFocus />
        </fieldset>
        <label htmlFor="usersBoxes">Current Box Assignment</label>
          <select value={item.boxId} id="usersBoxes" className="form-control" onChange={handleControlledInputChange}>
            {boxes.map(box => (
              <option boxid={box.id} key={box.id} value={box.location}>
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
              <button className="btn--submit-boxes" type="submit" onClick={submitUpdate}>Update</button>
              <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={handleDelete}>Delete</button>
            </div>
      </form>
      : <>Loading .. </>
    }
  </>)
}




{/* 

      <form action="" className="itemDetail__form">
       
       <fieldset className="form-group">
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
        </div> 
        <div className="boxDetail__summary">
          <div className="boxDetail__itemCount">
            <div className="boxDetail__itemCount__count">{ box?.totalItems }</div>
            <div>Items</div>
          </div>
          <Link to={`/items`}>
            <button id={`btn--edit-items`} className="boxDetail__linkBtn--edit">add/update items</button>
          </Link>
        </div> 
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
    </div> 
     </form>
 */}



{/* TODO: Need to find a way to have "0" - no selection as an option since user can create items before assigning a box*/}
{/* <option value="0">Select a location</option> */}
{/* <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={() => handleDelete(item.id)}>Delete</button> */}

// </>

          {/* <img className="itemDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
          <div className="itemDetail__description">
            <div>Description</div>
            <div className="itemDetail__description--text">{ item.description.substring(0, 20) + " . ." }</div>
            </div>
          <div className="itemDetail__value">
            <div>Value</div>
            <div className="itemDetail__value--value">${ item.value ? item.value : "0.00" }</div>
          </div>
          <label htmlFor="usersBoxes">Current Box Assignment</label>
          <select value={item.boxId} id="usersBoxes" className="form-control" onChange={handleControlledInputChange}>
            {boxes.map(box => (
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
              <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={handleDelete}>Delete</button>
            </div>
        </> */}