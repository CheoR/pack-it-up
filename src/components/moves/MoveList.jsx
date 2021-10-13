import React, { useContext, useEffect, useState, useRef } from 'react';

import { UserContext } from '../auth/UserProvider';
import { MoveContext } from './MoveProvider';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';

import { UserHeader } from '../helpers/UserHeader';
import { Counter } from '../counter/Counter';
import { MoveSummary } from './MoveSummary';

import { getSum2 } from '../helpers/helpers';

import styles from './moveList.module.css';

export const MoveList = () => {
  const { user } = useContext(UserContext);
  const { moves, getMovesByUserId, addMove, setMoves } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const [isLoading, setIsLoading] = useState(true);
  const [newMove, setNewMove] = useState({});

  const inputRef = useRef();

  const aggregateMoveInfo = () => {
    moves.forEach((move) => {
      const boxesForThisMove = boxes.filter((box) => box.moveId === move.id);

      move.totalBoxCount = boxesForThisMove.length;
      move.totalItemsCount = 0;
      move.totalItemsValue = 0;

      if (boxesForThisMove) {
        boxesForThisMove.forEach((box) => {
          const itemsInBox = items.filter((item) => item.boxId === box.id);
          move.totalItemsCount += itemsInBox.length;
          move.totalItemsValue += getSum2(itemsInBox.filter((item) => item.value || 0));
          box.isFragile = itemsInBox.some((item) => item.isFragile);
        }); // boxesForThisMove.forEach
      }

      /*
        Mark move fragile if any of its boxes are marked fragile.
        Boxes are marked fragile if any of its items are marked fragile.
      */
      move.isFragile = boxesForThisMove.some((thisBox) => thisBox.isFragile);
    }); // moves
    setMoves(moves);
  }; // aggregateMoveInfo

  const handleControlledInputChange = (event) => {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const updatedMove = { ...newMove };
    updatedMove.type[event.target.id] = event.target.value;
    // updatedMove.type[event.target.id] = inputRef.current.value; // event.target.value
    setNewMove(updatedMove);
  }; // handleControlledInputChange

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId(user.id)
      .then(getBoxesByUserId(user.id))
      .then(getItemsByUserId(user.id))
      .then(aggregateMoveInfo)
      .then(setIsLoading(false))
      .catch((err) => console.error(`Fetching Error: ${err}`));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setNewMove({
      type: {
        userId: user.id,
        moveName: 'New Move',
      },
      addObj: addMove,
      resetInputRef: inputRef,
      refresh: getMovesByUserId,
    });
    setIsLoading(false);
  }, []);

  if (isLoading) return <>Loading .. . </>;

  return (
    <section>
      <UserHeader user={user} text="Moves" />
      <ul className={styles.summary}>
        {
          moves.map((move) => <MoveSummary key={move.id} move={move} />)
        }
      </ul>
      <form action="" className="summary__form">
        <fieldset className={styles.summary__formGroup}>
          <label className={styles.moveNameLabel} htmlFor="moveName">Move Name:
            <input
              type="text"
              id="moveName"
              name="moveName"
              ref={inputRef}
              className={styles.formControl}
              placeholder="Add Move Name..."
              // value={newMove.type.moveName}
              onChange={(e) => { handleControlledInputChange(e); }} />
          </label>
        </fieldset>
      </form>
      <Counter objType={newMove} />
    </section>
  );
};
