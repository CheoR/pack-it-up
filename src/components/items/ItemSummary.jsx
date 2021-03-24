import React, { useContext } from "react"
import { Link, useHistory } from "react-router-dom"

import { ItemContext } from "./ItemProvider"
import "./itemSummary.css"


export const ItemSummary = ({ item } ) => {

  const { deleteItem } = useContext(ItemContext)
  const history = useHistory()

  const handleDelete = () => deleteItem(item.id).then(() => history.push("/items"))

 return (
  <section className="itemSummary">
   <img className="itemSummary__image" src="https://unsplash.com/photos/nP9WOiM41WE" alt="QR code place holder" />
    <div className="move">
     <p>Move</p>
     <div className="checkBox">{ item.hasAssociatedMove ? "X" : ""}</div>
    </div>
    <div className="description">
     <div>Description</div>
     <div className="description__text">{ item.description.substring(0, 12) + " . ." }</div>
    </div>
    <div className="box">
     <p>Box</p>
     <div className="checkBox">{ item.hasAssociatedBox? "X" : ""}</div>
    </div>
    <div className="value">
     <div>Value</div>
     <div className="description__value">${ item.value ? item.value : "0.00" }</div>
    </div>
    <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ item.isFragile ? "X" : ""}</div>
    </div>
    <div className="summary__btns">
     <Link to={`/items/${item.id}`}>
      <button id={`btn--edit-${item.id}`} className="summary__linkBtn--edit">Edit</button>
     </Link>
     <button id={`btn--delete-${item.id}`} className="summary__linkBtn--delete" onClick={handleDelete}>Delete</button>
    </div>
  </section>
 )
}