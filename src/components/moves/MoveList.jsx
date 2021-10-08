import React, { useContext, useEffect, useState } from 'react';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from './MoveProvider';
import { MoveSummary } from './MoveSummary';
import { getSum2 } from '../helpers/helpers';
import { Counter } from '../counter/Counter';
import styles from './moveList.module.css';

export const MoveList = () => {
  /*
    Todo: refactor code below.
  */

  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const loggedInUserName = sessionStorage.getItem(userStorageUserName);
  const { moves, setMoves, getMoves, addMove } = useContext(MoveContext);
  const { boxes, setBoxes, getBoxes } = useContext(BoxContext);
  const { items, setItems, getItems } = useContext(ItemContext);
  const [formField, setFormField] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getMoves()
      .then(getBoxes)
      .then(getItems)
      .then(() => setIsLoaded(true));
  }, []); // useEffect

  useEffect(() => {
    setFormField({
      type: {
        userId: loggedInUserId,
        moveName: 'New Move',
      },
      addObj: addMove,
    }); // setFormField

    const [movesData, boxesData, itemsData] = [moves, boxes, items]
      .map((type) => type.filter((obj) => obj.userId === loggedInUserId));

    setMoves(movesData);
    setBoxes(boxesData);
    setItems(itemsData);
  }, [isLoaded]); // useEffect

  const handleControlledInputChange = (event) => {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const newformField = { ...formField };
    newformField.type[event.target.id] = event.target.value;
    setFormField(newformField);
  }; // handleControlledInputChange

  moves.forEach((move) => {
    /*
    Aggregate box/item information per move.
    */

    const boxesForThisMove = boxes.filter((box) => box.moveId === move.id);

    move.totalBoxCount = boxesForThisMove.length;
    move.totalItemsCount = 0;
    move.totalItemsValue = 0;

    boxesForThisMove.forEach((box) => {
      const itemsInBox = items.filter((item) => item.boxId === box.id);

      move.totalItemsCount += itemsInBox.length;
      move.totalItemsValue += getSum2(itemsInBox.filter((item) => item.value || 0));
      box.isFragile = itemsInBox.some((item) => item.isFragile);
    }); // boxes.forEach

    /*
      Mark move fragile if any of its boxes are marked fragile.
      Boxes are marked fragile if any of its items are marked fragile.
    */
    move.isFragile = boxesForThisMove.some((box) => box.isFragile);
  }); // moves.forEach

  return (
    <>
      {
        isLoaded
          ? (
            <main className={styles.summary}>
              <h1 className={styles.summary__header}>`${loggedInUserName}&aposs Moves`</h1>
              {
                moves.map((move) => <MoveSummary key={move.id} move={move} />)
              }
              <form className="summary__form">
                <fieldset className={styles.summary__formGroup}>
                  {/* eslint-disable-next-line */}
                  <label className={styles.moveNameLabel} htmlFor='moveName'>Move Name: </label>
                  <input
                    type="text"
                    id="moveName"
                    name="moveName"
                    className={styles.formControl}
                    placeholder="Add Move Name..."
                    value={formField.type.moveName}
                    onChange={(e) => { handleControlledInputChange(e); }}
                  />
                </fieldset>
              </form>
              <Counter objType={formField} />
            </main>
          )
          : <>Loading</>
      }
    </>
  );
};
