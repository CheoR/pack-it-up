import React, { useContext } from "react"
import { Link, useHistory } from "react-router-dom"

import { BoxContext } from "./BoxProvider"
import "./boxSummary.css"


export const BoxSummary = ({ box } ) => {

  const { deleteBox } = useContext(BoxContext)
  const history = useHistory()
  const handleDelete = () => deleteBox(box.id).then(() => history.push("/users"))

 return (
  <section className="boxSummary">
   <img className="boxSummary__image" src="https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=750&q=80" alt="QR code place holder" />

   <div className="boxMove">
     <p>Move</p>
     <div className="boxMoveName">{ box.moveName }</div>
  </div>
  <div className="location">
     <p>Location</p>
     <div className="location__text">{ box.location }</div>
  </div>

    <div className="boxValue">
     <p>Value</p>
     <div className="box__value">${ box.totalValue }</div>
    </div>

    <div className="count">
     <div className="count__items">{ box.totalCount }</div>
     <div>Items</div>
    </div>
  
    <div className="lowerRow">

    <div className="fragile">
     <p>Fragile</p>
     <div className="checkBox">{ box.isFragile ? "X" : ""}</div>
    </div>
     <Link to={`/boxes/${box.id}`}>
      <button id={`btn--edit-${box.id}`} className="box__linkBtn--edit">Edit</button>
     </Link>
     {/* <Link to="/">
      <button id={`btn--delete-${box.id}`} className="box__linkBtn--delete">Delete</button>
     </Link> */}
           <button id={`btn--delete-${box.id}`} className="box__linkBtn--delete" onClick={handleDelete}>Delete</button>

    </div> 
  </section>
 )
}
