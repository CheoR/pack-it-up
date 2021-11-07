import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useHistory, useParams } from 'react-router-dom';

import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { ItemContext } from '../items/ItemProvider';

import styles from './boxDetail.module.css';

export const BoxDetail = () => {
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { getBoxByBoxId, updateBox, deleteBox } = useContext(BoxContext);
  const { getItemByItemId, updateItem } = useContext(ItemContext);
  const [dropdownSelection, setDropdownSelection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [boxDetail, setBoxDetail] = useState({});

  const location = useLocation();
  const history = useHistory();
  let { boxId } = useParams();

  /*
    In case user does a hard refresh, otherwise app will error out due to missing boxId.
  */
  boxId = parseInt(boxId, 10) || parseInt(location.pathname.split('/')[2], 10);

  const aggregateBoxInfo = (box) => {
    box.totalItemsCount = box.items.length;
    box.totalItemsValue = box.items.map((item) => item.value)
      .reduce((acc, curr) => acc + curr, 0);
    box.isFragile = box.items.some((item) => item.isFragile);

    setDropdownSelection(box.move.moveName);
    setBoxDetail(box);
  }; // aggregateMoveInfo

  const handleControlledDropDownChange = (event) => {
    const box = { ...boxDetail };

    // box[event.target.id] = event.target.value;

    const dropdownSelectionIndex = parseInt(event.target.options.selectedIndex, 10);
    /*
      User should not be able to select label.
    */
    if (!dropdownSelectionIndex) return;

    const updatedMoveId = parseInt(event.target.options[dropdownSelectionIndex].getAttribute('moveid'), 10);

    /*
      Default 1st move if no selection made.
      No select results in parseInt(updatedMoveId) is null.
    */
    setDropdownSelection(event.target.value);
    box.moveId = parseInt(updatedMoveId, 10) || moves[0].id;

    setBoxDetail(box);
    setHasSaved(false);
  }; // handleControlledInputChange

  const submitUpdate = (event) => {
    event.preventDefault();

    const box = { ...boxDetail };
    const itemIds = box.items.map((item) => item.id);

    /*
      Update box's associated items so they match moveId.
    */
    Promise.all(itemIds.map((id) => getItemByItemId(id)))
      .then((items) => items.forEach((item) => {
        item.moveId = box.moveId;
        delete item.box;
        updateItem(item);
      }))
      .catch((err) => console.error(`Promise all Error: ${err}`));

    /*
    Cleanup. Does not belong to ERD.
    */
    delete box.totalItemsCount;
    delete box.totalItemsValue;
    delete box.usersMoves;
    delete box.isFragile;
    delete box.items;
    delete box.move;

    updateBox(box);

    setHasSaved(true);
  }; // updateMove

  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(boxDetail.id)
      .then(() => history.push('/boxes'));
  };

  const handleControlledInputChange = (event) => {
    const box = { ...boxDetail };

    box[event.target.id] = event.target.value;

    setBoxDetail(box);
    setHasSaved(false);
  }; // handleControlledInputChange

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId()
      .then(() => getBoxByBoxId(boxId))
      .then(aggregateBoxInfo)
      .finally(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []);

  useEffect(() => {
    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved]);

  if (isLoading) return <>Loading Box Detail. . </>;

  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={`https://source.unsplash.com/featured/?${boxDetail?.location}`} alt={`${boxDetail?.location}`} />
      </div>
      <form className={styles.container__form}>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.locationLabel} htmlFor="location">Location:
            <input
              type="text"
              id="location"
              name="location"
              className={styles.formControl}
              placeholder="Add boxDetail Location ..."
              value={boxDetail.location}
              onChange={(e) => { handleControlledInputChange(e); }}
            />
          </label>
        </fieldset>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.valueLabel} htmlFor="value">Value
            <input
              type="text"
              id="value"
              name="value"
              className={styles.formControl}
              placeholder="Box Value"
              value={`$${boxDetail?.totalItemsValue || '0.00'}`}
              disabled
            />
          </label>
        </fieldset>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.dropdownLabel} htmlFor="container__dropdown">Move
            {/* excluding value={dropdownSelection}
            shows dropdownSelection move, including it always shows default */}
            <select
              id="container__dropdown"
              className={styles.formControl}
              value={dropdownSelection}
              onChange={handleControlledDropDownChange}
              required
            >
              <option value={boxDetail.move.id || 0}>Move</option>
              {moves.map((move) => (
                <option moveid={move.id} key={move.id} value={move.moveName}>
                  {move.moveName}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <div className={styles.counts}>
          <div className={styles.container__itemCount}>
            <div>
              {boxDetail?.totalItemsCount}
            </div>
            <div>
              Items
            </div>
          </div>
          <NavLink
            className={styles.container__navlink}
            to={{
              pathname: '/items',
              state: {
                boxDetail: parseInt(boxId, 10),
              },
            }}>
            <button
              type="button"
              id="btn--edit-items"
              className={styles.container__navlinkBtn}
            >
              add/update items
            </button>
          </NavLink>
        </div>

        <NavLink to={`/moves/${boxDetail?.moveId}`} className={styles.container__navlink}>
          <button type="button" id="btn--viewMove" className={styles.container__navlinkBtn}>
            View Move Assigned
          </button>
        </NavLink>

        <div className={styles.buttons}>
          <fieldset className={styles.fragile__checkbox}>
            <label className={styles.fragile__checkboxLabel} htmlFor="isFragile">Fragile
              <input
                type="checkbox"
                id="isFragile"
                checked={boxDetail?.isFragile}
                className={styles.formControl}
                readOnly
              />
            </label>
          </fieldset>
          <button
            type="submit"
            className={styles.container__btn__submit}
            onClick={submitUpdate}
          >
            Update
          </button>
          <button
            type="button"
            id={`btn--delete-${boxDetail?.id}`}
            className={styles.container__btn__delete}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </form>
    </section>
  );
};
