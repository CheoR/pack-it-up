// import React, { useContext, useEffect, useRef, useState } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
import { MoveSummary } from './MoveSummary';
// import { MoveContext } from './MoveProvider';
import { Counter } from '../counter/Counter';

import styles from './moveList.module.css';
import { useFilteredData } from '../helpers/useFilterdData';

export const MoveList = () => {
  // const { moves, getMovesByUserId, addMove } = useContext(MoveContext);
  const { moves, addMove } = useFilteredData();

  const [isLoading, setIsLoading] = useState(true);
  const [formField, setFormField] = useState({});
  const [userInfo, setUserInfo] = useState({
    loggedInUserId: 0,
    loggedInUserName: '',
  });

  const inputRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
    const loggedInUserName = sessionStorage.getItem(userStorageUserName);

    setUserInfo({
      loggedInUserId,
      loggedInUserName,
    });

    setFormField({
      type: {
        userId: loggedInUserId,
        moveName: 'New Move',
      },
      addObj: addMove,
      resetInputRef: inputRef,
    });
    setIsLoading(false);
  }, []); // useEffect

  // useEffect(() => {
  //   getMovesByUserId();
  //   setIsLoading(false);
  // }, []); // useEffect

  const handleControlledInputChange = (event) => {
    /*
      TODO: Form needs to clear aroud after submission.
    */
    const newformField = { ...formField };
    newformField.type[event.target.id] = inputRef.current.value; // event.target.value

    setFormField(newformField);
  }; // handleControlledInputChange

  if (isLoading) return <div>Loading</div>;

  return (
    <>
      {
        !isLoading && moves
          ? (
            <main className={styles.summary}>
              <h1 className={styles.summary__header}>
                {`${userInfo.loggedInUserName || 'User'}'s Moves`}
              </h1>
              {
                moves.map((move) => <MoveSummary key={move.id} move={move} />)
              }
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
                      // value={formField.type.moveName}
                      onChange={(e) => { handleControlledInputChange(e); }} />
                  </label>
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
