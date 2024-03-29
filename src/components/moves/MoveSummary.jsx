import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { MoveContext } from './MoveProvider';
import { ItemContext } from '../items/ItemProvider';

import styles from './moveSummary.module.css';

export const MoveSummary = ({ move }) => {
  const { deleteMove } = useContext(MoveContext);
  const { deleteItem } = useContext(ItemContext);

  const history = useHistory();

  const handleDelete = (event) => {
    event.preventDefault();
    /*
      json-server only deletes boxes linked to current move and not thier associated items.
      So delete associated items first (if any) before delete move and boxes.
    */
    if (move.items.length) {
      Promise.all(move.items.map((item) => deleteItem(item.id)))
        .then(() => deleteMove(move.id))
        .then(() => history.push('/moves'))
        .catch((err) => console.error(`Promise all error: ${err}`));
    } else {
      deleteMove(move.id)
        .then(() => history.push('/moves'));
    }
  }; // handleDelete
  return (
    <section className={styles.summary}>

      <div className={styles.summary__move}>Move</div>
      <div className={styles.summary__move__move}>{ `${move.moveName.substring(0, 5)} . .` }</div>

      <div className={styles.summary__value}>Value</div>
      <div className={styles.summary__value__value}>${ move.totalItemsValue || '0.00' }</div>

      <div className={styles.summary__boxCount}>
        <div className={styles.summary__boxCount__count}>{ move.totalBoxesCount }</div>
        <div className={styles.summary__boxCount__box}>Boxes</div>
      </div> {/* summary__boxCount */}
      <div className={styles.summary__itemCount}>
        <div className={styles.summary__itemCount__count}>{ move.totalItemsCount }</div>
        <div className={styles.summary__itemCount__item}>Items</div>
      </div> {/* summary__itemCount */}

      <fieldset className={styles.fragile__checkbox}>
        <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">
          Fragile
          <input type="checkbox" name="summaryFragile" id="summaryFragile" checked={move.isFragile || false} className={styles.formControl} readOnly />
        </label>
      </fieldset>

      <NavLink to={`/moves/${move.id}`} className={styles.summary__navlink__edit}>
        <button type="button" id={`btn--edit-${move.id}`} className={styles.summary__navlinkBtn__edit}>Edit</button>
      </NavLink>

      <button type="button" id={`btn--delete-${move.id}`} className={styles.summary__btn__delete} onClick={handleDelete}>Delete</button>

    </section>
  );
};
