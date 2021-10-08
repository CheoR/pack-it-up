import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { ItemContext } from './ItemProvider';
import styles from './itemSummary.module.css';

export const ItemSummary = ({ item }) => {
  const { deleteItem } = useContext(ItemContext);
  const history = useHistory();

  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(item.id).then(() => history.push('/items'));
  }; // handleDelete

  return (
    <section className={styles.summary}>
      <div className={styles.summary__image_summary}>
        { item.imagePath && (
          <img className={styles.summary__image} src={item.imagePath} alt="User-defined item" />
        )}
      </div>

      <fieldset className={styles.move__checkbox}>
        {/* eslint-disable-next-line */}
        <label className={styles.move__checkboxLabel} htmlFor='summaryMove'>Move</label>
        <input type="checkbox" id="summaryMove" checked={item.hasAssociatedMove} className={styles.formControl} readOnly />
      </fieldset>
      <fieldset className={styles.box__checkbox}>
        {/* eslint-disable-next-line */}
        <label className={styles.box__checkboxLabel} htmlFor="summaryBox">Box</label>
        <input type="checkbox" id="summaryBox" checked={item.hasAssociatedBox} className={styles.formControl} readOnly />
      </fieldset>
      <fieldset className={styles.fragile__checkbox}>
        {/* eslint-disable-next-line */}
        <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile</label>
        <input type="checkbox" id="summaryFragile" checked={item.isFragile} className={styles.formControl} readOnly />
      </fieldset>

      <div className={styles.summary__description}>Description</div>
      <div className={styles.summary__description__description}>{ `${item.description.substring(0, 9)} . . `}</div>

      <div className={styles.summary__value}>Value</div>
      <div className={styles.summary__value__value}>${ item?.value || '0.00' }</div>

      <NavLink to={`/items/${item.id}`} className={styles.container__navlink__edit}>
        <button type="button" id={`btn--edit-${item.id}`} className={styles.container__navlinkBtn__edit}>Edit</button>
      </NavLink>

      <button type="button" id={`btn--delete-${item?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>
    </section>
  );
};
