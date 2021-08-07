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
          <img className={styles.summary__image} src={item.imagePath} alt="User-defined" />
        )}
      </div>

      <fieldset className={styles.move__checkbox}>
        <label className={styles.move__checkboxLabel} htmlFor="summaryMove">Move
          <input type="checkbox" id="summaryMove" checked={item.hasAssociatedMove} className={styles.formControl} readOnly />
        </label>
      </fieldset>
      <fieldset className={styles.box__checkbox}>
        <label className={styles.box__checkboxLabel} htmlFor="summaryBox">Box
          <input type="checkbox" id="summaryBox" checked={item.hasAssociatedBox} className={styles.formControl} readOnly />
        </label>
      </fieldset>
      <fieldset className={styles.fragile__checkbox}>
        <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile
          <input type="checkbox" id="summaryFragile" checked={item.isFragile} className={styles.formControl} readOnly />
        </label>
      </fieldset>

      <div className={styles.summary__description}>Description</div>
      <div className={styles.summary__description__description}>{`${item.description.substring(0, 5)}. . ` }</div>

      <div className={styles.summary__value}>Value</div>
      <div className={styles.summary__value__value}>${ item?.value ? item?.value : '0.00' }</div>

      <NavLink to={`/items/${item.id}`} className={styles.container__navlink__edit}>
        <button type="button" id={`btn--edit-${item.id}`} className={styles.container__navlinkBtn__edit}>Edit</button>
      </NavLink>

      <button type="button" id={`btn--delete-${item?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>
    </section>
  );
};
