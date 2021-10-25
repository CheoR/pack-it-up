import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { BoxContext } from './BoxProvider';
import styles from './boxSummary.module.css';

export const BoxSummary = ({ box }) => {
  const { deleteBox } = useContext(BoxContext);
  const history = useHistory();

  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(box.id).then(() => history.push('/boxes'));
  }; // handleDelete

  return (
    <section className={styles.summary}>
      <div className={styles.summary__figure}>
        <img className={styles.summary__image} src="https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=750&q=80" alt="QR code place holder" />
      </div>

      <div className={styles.container__itemCount}>
        <div className={styles.container__itemCount__count}>{ box.totalItemsCount }</div>
        <div className={styles.container__itemCount__item}>Items</div>
      </div> {/* container__itemCount */}

      <fieldset className={styles.move__checkbox}>
        <label className={styles.move__checkboxLabel} htmlFor="summaryBox">Move
          <input type="checkbox" id="summaryBox" checked={box.moveId || 0} className={styles.formControl} readOnly />
        </label>
      </fieldset>
      <fieldset className={styles.fragile__checkbox}>
        <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile
          <input type="checkbox" id="summaryFragile" checked={box.isFragile || false} className={styles.formControl} readOnly />
        </label>
      </fieldset>

      <div className={styles.summary__location}>Location</div>
      <div className={styles.summary__location__location}>{`${box.location.substring(0, 5)} . .`}</div>

      <div className={styles.summary__value}>Value</div>
      <div className={styles.summary__value__value}>${ box.totalItemsValue || '0.00' }</div>

      <NavLink to={`/boxes/${box.id}`} className={styles.container__navlink__edit}>
        <button type="button" id={`btn--edit-${box.id}`} className={styles.container__navlinkBtn__edit}>Edit</button>
      </NavLink>

      <button type="button" id={`btn--delete-${box.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>
    </section>
  );
};
