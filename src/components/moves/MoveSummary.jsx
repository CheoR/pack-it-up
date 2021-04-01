import React, { useContext } from "react"
import { Link, useHistory } from "react-router-dom"
import { MoveContext } from "./MoveProvider"

import styles from "./moveSummary.module.css"


export const MoveSummary = ({ move } ) => {

  const { deleteMove } = useContext(MoveContext)
  const history = useHistory()
  const handleDelete = () => deleteMove(move.id).then(() => history.push("/moves"))

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
      <button id={`btn--delete-${move.id}`} className="move__linkBtn--delete" onClick={handleDelete}>Delete</button>
    </div> 
  </section>
 )
}
