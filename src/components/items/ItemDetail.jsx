import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"

import { userStorageKey } from "../auth/authSettings"
import { BoxContext } from "../boxes/BoxProvider"
import { ItemContext } from "./ItemProvider"
import "./itemDetail.css"


export const ItemDetail = () => {

  const { boxes, getBoxes, setBoxes } = useContext(BoxContext)
  const { items, getItems, deleteItem } = useContext(ItemContext)
  
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ item, setItem ] = useState({})
  
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey))
  const history = useHistory()
  const { itemId } = useParams()


 useEffect(() => {
  getBoxes()
   .then(getItems)
   .then(() => setIsLoaded(true))
 }, []) // useEffect


 useEffect(() => {
  setBoxes(boxes.filter(box => box.userId === loggedInUserId))
  setItem(items.find(item => item.id === parseInt(itemId)))
 }, [items, isLoaded])


 const handleDelete = () => deleteItem(item?.id).then(() => history.push("/items"))
 const handleControlledInputChange = ( event ) => console.log("selection made")

 return (
  /*
   TODO: change this into a form so user can update form fields and use useState
  */

  <section className="itemDetail">
    { isLoaded
      ?
        <>
          <img className="itemDetail__image" src="https://source.unsplash.com/featured/?item" alt="user item" />
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
        </>
      : <div>Loading . . . </div>
    }
  </section>
  )
}

{/* TODO: Need to find a way to have "0" - no selection as an option since user can create items before assigning a box*/}
{/* <option value="0">Select a location</option> */}
{/* <button id={`btn--delete-${item.id}`} className="item__linkBtn--delete" onClick={() => handleDelete(item.id)}>Delete</button> */}