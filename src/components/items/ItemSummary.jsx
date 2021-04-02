import React, { useContext } from "react"
import { Link, NavLink, useHistory } from "react-router-dom"

import { ItemContext } from "./ItemProvider"
import styles from "./itemSummary.module.css"


export const ItemSummary = ({ item } ) => {

  const { deleteItem } = useContext(ItemContext)
  const history = useHistory()

  const handleDelete = () => deleteItem(item.id).then(() => history.push("/items"))

 return (
  <section className={styles.summary}>
    <img className={styles.summary__image} src="https://unsplash.com/photos/nP9WOiM41WE" alt="QR code place holder" />

    <fieldset className={styles.move__checkbox}>
      <label className={styles.move__checkboxLabel} htmlFor="summaryMove">Move</label>
      <input type="checkbox" id="summaryMove" checked={item.hasAssociatedMove}  className={styles.formControl} readOnly />
    </fieldset>
    <fieldset className={styles.box__checkbox}>
      <label className={styles.box__checkboxLabel} htmlFor="summaryBox">Box</label>
      <input type="checkbox" id="summaryBox" checked={item.hasAssociatedBox}  className={styles.formControl} readOnly />
    </fieldset>
    <fieldset className={styles.fragile__checkbox}>
      <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile</label>
      <input type="checkbox" id="summaryFragile" checked={item.isFragile}  className={styles.formControl} readOnly />
    </fieldset>


    <div className={styles.summary__description}>Description</div>
    <div className={styles.summary__description__description}>{ item.description.substring(0, 9) + " . ." }</div>

    <div className={styles.summary__value}>Value</div>
    <div className={styles.summary__value__value}>${ item?.value ? item?.value : "0.00" }</div>
    
    <NavLink to={`/items/${item.id}`} className={styles.container__navlink__edit}>
      <button id={`btn--edit-${item.id}`} className={styles.container__navlinkBtn__edit}>Edit</button>
    </NavLink>

    <button id={`btn--delete-${item?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>
  </section>
 )
}

/*

        <NavLink to={`/items/${item.id}`} className={styles.container__navlink__edit}>
          <button id={`btn--edit-${item.id}`} className={styles.container__navlinkBtn__edit}>Edit</button>
        </NavLink>



     <Link to={`/items/${item.id}`}>
      <button id={`btn--edit-${item.id}`} className="summary__linkBtn--edit">Edit</button>
     </Link>


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





            <fieldset className={styles.fragile__checkbox}>
          <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile</label>
          <input type="checkbox" id="isFragile" checked={box?.isFragile}  className={styles.formControl} readOnly />
        </fieldset>
*/