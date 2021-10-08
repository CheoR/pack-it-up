import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import { userStorageKey } from '../auth/authSettings';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { getSum3 } from '../helpers/helpers';
import styles from './boxDetail.module.css';

export const BoxDetail = () => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const { moves, setMoves, getMoves } = useContext(MoveContext);
  const { boxes, getBoxes, updateBox, deleteBox } = useContext(BoxContext);
  const { items, setItems, getItems } = useContext(ItemContext);
  const [formField, setFormField] = useState({
    userId: loggedInUserId,
    moveId: 0,
    location: '',
    qrCode: '',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [selected, setSelected] = useState('');
  const [box, setBox] = useState({});
  const { boxId } = useParams();

  useEffect(() => {
    getMoves()
      .then(getBoxes)
      .then(getItems)
      .then(() => setIsLoaded(true));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded && boxes) {
      const _box = boxes.find((b) => b?.id === parseInt(boxId, 10));
      setBox(_box);
      setMoves(moves.filter((move) => move?.userId === loggedInUserId));
      setItems(items.filter((item) => item?.boxId === _box?.id));

      setSelected(_box.move.moveName);
      setFormField({
        id: _box?.id,
        userId: loggedInUserId,
        moveId: _box?.moveId,
        location: _box?.location,
        qrCode: '',
      });
    } // if

    if (hasSaved) {
      window.alert('Updated');
    }
  }, [boxes, isLoaded]);

  if (box) {
    box.totalItems = items?.length;
    box.totalValue = getSum3(items.map((item) => item?.value || 0));
    box.isFragile = items.some((item) => item?.isFragile);
  }

  const history = useHistory();
  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(box?.id).then(() => history.push('/boxes'));
  };

  const handleControlledDropDownChange = (event) => {
    const newformField = { ...formField };
    newformField[event.target.id] = event.target.value;

    const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    const optionId = event.target.options[selectedIndex].getAttribute('boxid');

    /*
      Default 1st move if no selection made.
      No select results in praseInt(optionId) is null.
    */
    setSelected(event.target.value);
    newformField.moveId = parseInt(optionId, 10) || moves[0].id;
    setFormField(newformField);
    setHasSaved(false);
  }; // handleControlledInputChange

  const handleControlledInputChange = (event) => {
    const newformField = { ...formField };
    newformField[event.target.id] = event.target.value;
    setFormField(newformField);
    setHasSaved(false);
  }; // handleControlledInputChange

  const submitUpdate = (event) => {
    event.preventDefault();
    const newformField = { ...formField };

    /*
      Cleanup. Does not belong to ERD.
    */
    delete newformField.usersMoves;
    updateBox(newformField);
    setHasSaved(true);
  }; // updateMove

  return (
    <>
      {
        isLoaded
          ? (
            <main className={styles.container}>
              <img className={styles.container__image} src={`https://source.unsplash.com/featured/?${box?.location}`} alt={`${box?.location}`} />
              <form className={styles.container__form}>
                <fieldset className={styles.container__formGroup}>
                  {/* eslint-disable-next-line */}
                  <label className={styles.locationLable} htmlFor='location'>Location: </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={styles.formControl}
                    placeholder="Add Box Location ..."
                    value={formField.location}
                    onChange={(e) => { handleControlledInputChange(e); }}
                  />
                  <div className={styles.container__value}>Value</div>
                  <div className={styles.container__value__value}>${ box?.totalValue || '0.00' }</div>

                  {/* eslint-disable-next-line */}
                  <label className={styles.container__dropdownLabel} htmlFor='usersMoves'>Current Move Assignment</label>
                  {/* excluding value={selected} shows selected move,
                    including it always shows default */}
                  <select id="usersMoves" value={selected} className={styles.formControl} onChange={handleControlledDropDownChange}>
                    <option value="0">Move</option>
                    {moves.map((move) => (
                      <option boxid={move.id} key={move.id} value={move.moveName}>
                        {move.moveName}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <div className={styles.container__itemCount}>
                  <div className={styles.container__itemCount__count}>{ box?.totalItems }</div>
                  <div className={styles.container__itemCount__item}>Items</div>
                </div> {/* container__itemCount */}
                <NavLink
                  to={
                    {
                      pathname: '/items',
                      state: {
                        box: parseInt(boxId, 10),
                      },
                    }
                  }
                  className={styles.container__navlink}>
                  <button type="button" id="btn--edit-items" className={styles.container__navlinkBtn}>
                    add/update items
                  </button>
                </NavLink>
                <NavLink to={`/moves/${box?.moveId}`} className={styles.container__navlink__view}>
                  <button type="button" id="btn--viewMove" className={styles.container__navlinkBtn__view}>view move</button>
                </NavLink>

                <fieldset className={styles.fragile__checkbox}>
                  {/* eslint-disable-next-line */}
                  <label className={styles.fragie__checkboxLabel} htmlFor='isFragile'>Fragile</label>
                  <input type="checkbox" id="isFragile" checked={box?.isFragile} className={styles.formControl} readOnly />
                </fieldset>

                <button className={styles.container__btn__submit} type="submit" onClick={submitUpdate}>Update</button>
                <button type="button" id={`btn--delete-${box?.id}`} className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>
              </form>
            </main>
          )
          : <> Loading ... </>
    }
    </>
  );
};
