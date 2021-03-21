import React from "react"
import { Link } from "react-router-dom"

import "./itemSummary.css"


export const ItemSummary = ({ item } ) => {

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
     <Link to="/">
      <button id={`btn--delete-${item.id}`} className="summary__linkBtn--delete">Delete</button>
     </Link>
    </div>
  </section>
 )
}