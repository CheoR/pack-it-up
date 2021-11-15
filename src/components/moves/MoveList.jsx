import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import { MoveContext } from './MoveProvider';

import { UserHeader } from '../helpers/UserHeader';
import { Counter } from '../counter/Counter';
import { MoveSummary } from './MoveSummary';

import { Loading } from '../loading/Loading';

import styles from './moveList.module.css';

export const MoveList = () => {
  const { user } = useContext(UserContext);
  const { moves, getMovesByUserId, addMove, setMoves } = useContext(MoveContext);

  const [isLoading, setIsLoading] = useState(true);
  const [newMove, setNewMove] = useState({});
  const [value, setValue] = useState('New Move');

  const aggregateMoveInfo = () => {
    setMoves((prevState) => {
      const _moves = [...prevState];

      _moves.forEach((move) => {
        move.totalBoxesCount = move.boxes.length;
        move.totalItemsCount = move.items.length;
        move.totalItemsValue = move.items.map((item) => item.value)
          .reduce((acc, curr) => acc + curr, 0);
        move.isFragile = move.items.some((item) => item.isFragile);
      });
      return _moves;
    });
  }; // aggregateMoveInfo

  const handleControlledInputChange = (event) => {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const updatedMove = { ...newMove };
    updatedMove.type[event.target.id] = event.target.value;
    setNewMove(updatedMove);
    setValue(event.target.value);
  }; // handleControlledInputChange

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId()
      .then(aggregateMoveInfo)
      .then(() => {
        setNewMove({
          type: {
            userId: user.id,
            moveName: value,
          },
          addObj: addMove,
          resetInput: setValue,
        });
      })
      .then(() => setIsLoading(false))
      .catch((err) => console.error(`Fetching Error: ${err}`));
  }, []);

  useEffect(() => {
    /*
      Page dose not refresh/delete correctly. Sometimes delete
      finshes after page has refreshed. Sometimes before. Adding
      boxes as dependency in earlier useEffect causes infinite loop.
    */
    aggregateMoveInfo();
  }, [moves.length]);

  if (isLoading) return <Loading />;

  return (
    <section>
      <UserHeader user={user} text="Moves" />
      <ul className={styles.summary}>
        {
          moves.map((move) => <MoveSummary key={move.id} move={move} />)
        }
      </ul>
      <fieldset className={styles.summary__formGroup}>
        <label className={styles.moveNameLabel} htmlFor="moveName">Move Name:
          <input
            type="text"
            id="moveName"
            name="moveName"
            className={styles.formControl}
            placeholder="Add Move Name..."
            value={value}
            onChange={(e) => { handleControlledInputChange(e); }}
          />
        </label>
      </fieldset>
      <Counter objType={newMove} />
    </section>
  );
};
