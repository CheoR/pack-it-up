import React from "react"
import { Link } from "react-router-dom"

import "./moveSummary.css"


export const MoveSummary = ({ move } ) => {

 return (
  <section className="moveSummary">
    <div className="boxCount">
     <div className="boxCount__count">{ move.totalBoxCount }</div>
     <div>Boxes</div>
    </div>
    <div className="moveName">
      <p>Move</p>
      <div className="moveName">{ move.moveName }</div>
    </div>
      <div className="itemCount">
     <div className="itemCount__count">{ move.totalItemsCount }</div>
     <div>Items</div>
    </div>
    <div className="moveValue">
     <p>Value</p>
     <div className="move__value">${ move.totalItemsValue }</div>
    </div>

    <div className="lowerRow">

    <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ move.isFragile ? "X" : ""}</div>
    </div>
     <Link to={`/moves/${move.id}`}>
      <button id={`btn--edit-${move.id}`} className="move__linkBtn--edit">Edit</button>
     </Link>
     <Link to="/">
      <button id={`btn--delete-${move.id}`} className="move__linkBtn--delete">Delete</button>
     </Link>
    </div> 
  </section>
 )
}
