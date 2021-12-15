import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useHistory, useParams } from 'react-router-dom';

import { MoveContext } from './MoveProvider';
import { ItemContext } from '../items/ItemProvider';

import { Loading } from '../loading/Loading';

import styles from './moveDetail.module.css';

export const MoveDetail = () => {
  const { getMoveByMoveId, updateMove, deleteMove } = useContext(MoveContext);
  const { deleteItem } = useContext(ItemContext);

  const [isLoading, setIsLoading] = useState(true);
  const [moveDetail, setMoveDetail] = useState({});
  const [hasSaved, setHasSaved] = useState(false);

  const location = useLocation();
  const history = useHistory();
  let { moveId } = useParams();

  /*
    In case user does a hard refresh, otherwise app will error out due to missing moveId.
  */
  moveId = parseInt(moveId, 10) || parseInt(location.pathname.split('/')[2], 10);

  const handleDelete = (event) => {
    event.preventDefault();
    /*
      json-server only deletes boxes linked to current move and not thier associated items.
      So delete associated items first (if any) before delete move and boxes.
    */
    if (moveDetail.items.length) {
      Promise.all(moveDetail.items.map((item) => deleteItem(item.id)))
        .then(() => deleteMove(moveDetail.id))
        .then(() => history.push('/moves'))
        .catch((err) => console.error(`Promise all error: ${err}`));
    } else {
      deleteMove(moveDetail.id)
        .then(() => history.push('/moves'));
    }
  }; // handleDelete

  const handleControlledInputChange = (event) => {
    const _move = { ...moveDetail };

    _move[event.target.id] = event.target.value;
    setMoveDetail(_move);
    setHasSaved(false);
  }; // handleControlledInputChange

  const submitUpdate = (event) => {
    event.preventDefault();
    const _move = { ...moveDetail };

    /*
      Cleanup. Does not belong to ERD.
    */
    delete _move.totalItemsValue;
    delete _move.totalBoxesCount;
    delete _move.totalItemsCount;
    delete _move.isFragile;
    delete _move.boxes;
    delete _move.items;

    updateMove(_move);
    setHasSaved(true);
  }; // updateMove

  const aggregateMoveInfo = () => {
    setMoveDetail((prevState) => {
      const move = { ...prevState };

      move.totalBoxesCount = move.boxes.length;
      move.totalItemsCount = move.items.length;
      move.totalItemsValue = move.items.map((item) => item.value)
        .reduce((acc, curr) => acc + curr, 0);
      move.isFragile = move.items.some((item) => item.isFragile);

      return move;
    });
  }; // aggregateMoveInfo

  useEffect(() => {
    setIsLoading(true);
    getMoveByMoveId(moveId)
      .then(setMoveDetail)
      .then(aggregateMoveInfo)
      .then(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []); // useEffect

  useEffect(() => {
    if (hasSaved) {
      window.alert('Updated');
    }
  }, [hasSaved, isLoading]); // useEffect

  if (isLoading) return <Loading />;

  return (
    <section className={styles.container}>
      <form action="" className={styles.container__form}>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.moveNameLabel} htmlFor="moveName">Move:
            <input
              type="text"
              id="moveName"
              name="moveName"
              className={styles.formControl}
              placeholder="Add Move Name..."
              value={moveDetail?.moveName}
              onChange={(e) => { handleControlledInputChange(e); }} />
          </label>
        </fieldset>
        <fieldset className={styles.container_fieldset}>
          <label className={styles.valueLabel} htmlFor="value">Value:
            <input
              type="text"
              id="value"
              name="value"
              className={styles.formControl}
              placeholder="Move Value"
              value={`$${moveDetail?.totalItemsValue || '0.00'}`}
              disabled />
          </label>
        </fieldset>
        <div className={styles.counts}>
          <div className={styles.container__boxCount}>
            <div>
              { moveDetail?.totalBoxesCount || '0' }
            </div>
            <div>
              Boxes
            </div>
          </div>
          <NavLink
            className={styles.container__navlink}
            to={{
              pathname: '/boxes',
              state: {
                move: parseInt(moveId, 10),
              },
            }}>
            <button
              type="button"
              id="btn--edit-boxes"
              className={styles.container__navlinkBtn}
            >
              add/update boxes
            </button>
          </NavLink>
        </div>
        <div className={styles.counts}>
          <div className={styles.container__itemCount}>
            <div>
              {moveDetail.totalItemsCount}
            </div>
            <div>
              Items
            </div>
          </div>
          {
            moveDetail?.totalBoxesCount
              ? (
                <NavLink
                  className={styles.container__navlink}
                  to={{
                    pathname: '/items',
                  }}>
                  <button
                    type="button"
                    id="btn--edit-items"
                    className={styles.container__navlinkBtn}
                  >
                    add/update items
                  </button>
                </NavLink>
              )
              : <div className={styles.container__navlinkBtnHide} />
          }
        </div>

        <div className={styles.buttons}>
          <fieldset className={styles.fragile__checkbox}>
            <label className={styles.fragile__checkboxLabel} htmlFor="isFragile">Fragile
              <input
                type="checkbox"
                id="isFragile"
                checked={moveDetail?.isFragile}
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
            id={`btn--delete-${moveDetail?.id}`}
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
