import React, { useContext } from "react"
import { Link, NavLink, useHistory } from "react-router-dom"
import { MoveContext } from "./MoveProvider"

import styles from "./moveSummary.module.css"


export const MoveSummary = ({ move } ) => {

  const { deleteMove } = useContext(MoveContext)
  const history = useHistory()
  const handleDelete = () => deleteMove(move.id).then(() => history.push("/moves"))

 return (
  <section className={styles.summary}>

    <div className={styles.summary__move}>Move</div>
    <div className={styles.summary__move__move}>{ move.moveName.substring(0, 9) + " . ." }</div>

    <div className={styles.summary__value}>Value</div>
    <div className={styles.summary__value__value}>${ move.totalItemsValue ? move.totalItemsValue : "0.00" }</div>


    <div className={styles.summary__boxCount}>
      <div className={styles.summary__boxCount__count}>{ move.totalBoxCount }</div>
      <div className={styles.summary__boxCount__box}>Boxes</div>
    </div> {/* summary__boxCount */}
    <div className={styles.summary__itemCount}>
      <div className={styles.summary__itemCount__count}>{ move.totalItemsCount }</div>
      <div className={styles.summary__itemCount__item}>Items</div>
    </div> {/* summary__itemCount */}

    <fieldset className={styles.fragile__checkbox}>
      <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile</label>
      <input type="checkbox" id="summaryFragile" checked={move.isFragile}  className={styles.formControl} readOnly />
    </fieldset>

    <NavLink to={`/moves/${move.id}`} className={styles.summary__navlink__edit}>
      <button id={`btn--edit-${move.id}`} className={styles.summary__navlinkBtn__edit}>Edit</button>
    </NavLink>

    <button id={`btn--delete-${move.id}`} className={styles.summary__btn__delete} onClick={handleDelete}>Delete</button>

  </section>
 )
}

/*


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


*/