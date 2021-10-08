import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { BoxSummary } from './BoxSummary';
import { Counter } from '../counter/Counter';
import { getSum1 } from '../helpers/helpers';
import styles from './boxList.module.css';

export const BoxList = () => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const loggedInUserName = sessionStorage.getItem(userStorageUserName);
  const { moves, setMoves, getMoves } = useContext(MoveContext);
  const { boxes, setBoxes, getBoxes, addBox } = useContext(BoxContext);
  const { items, setItems, getItems } = useContext(ItemContext);
  // const [formField, setFormField] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [newBox, setNewBox] = useState({});
  const location = useLocation();
  const [setSelected] = useState(0);
  // const [move, setMove] = useState({});

  /*
    The .then doesn't wait since set_
    Good to have useEffec watch that state variable.
  */
  useEffect(() => {
    getMoves()
      .then(getBoxes)
      .then(getItems)
      .then(() => setIsLoaded(true));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded) {
      const [movesData, boxesData, itemsData] = [moves, boxes, items]
        .map((type) => type.filter((obj) => obj.userId === loggedInUserId));
      setMoves(movesData);
      setBoxes(boxesData);
      setItems(itemsData);

      /*
        If user comes from move detail page, assign new items to that box.
      */
      const defaultMoveId = location.state && location.state.move
        ? location.state.move
        : moves[0].id;

      setNewBox({
        type: {
          userId: loggedInUserId,
          moveId: defaultMoveId,
          location: 'Change Box Location',
          qrCode: '',
        },
        addObj: addBox,
      }); // setNewBox
    } // if isLoaded
  }, [isLoaded]);

  /*
    Boxes should aggregate information about its contents.
  */
  boxes.forEach((box) => {
    const itemsForThisBox = items.filter((item) => item.boxId === box.id);
    box.totalCount = itemsForThisBox.length;
    box.totalValue = getSum1(itemsForThisBox.map((item) => item.value || 0));
    box.isFragile = itemsForThisBox.some((item) => item.isFragile);
    box.moveName = box?.move?.moveName;
  }); // boxes.forEach

  const handleControlledDropDownChange = (event) => {
    /*
      moveid - moveId, not option value.
    */
    const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    const optionId = event.target.options[selectedIndex].getAttribute('moveid');
    const updateBox = { ...newBox };

    /*
      Default 1st move if no selection made.
      No select results in praseInt(optionId) is null.
    */
    setSelected(parseInt(optionId, 10));
    updateBox.type.moveId = parseInt(optionId, 10) || newBox.defaultMoveId;
    setNewBox(updateBox);
  }; // handleControlledDropDownChange

  return (
    <>
      {
        isLoaded
          ? (
            <main className={styles.summary}>
              <h1 className={styles.summary__header}>`${loggedInUserName}&aposs Boxes`</h1>
              {
                boxes.map((box) => <BoxSummary key={box.id} box={box} />)
              }

              <fieldset className={styles.container__formGroup}>
                {/* eslint-disable-next-line */}
                <label className={styles.usersMovesLabel} htmlFor="usersMoves">Assign To Move</label>
                <select
                  id="usersMoves"
                  className={styles.formControl}
                  onChange={handleControlledDropDownChange}
                  required>
                  <option value="0">Select Move</option>
                  {
                    moves.map((move) => (
                      <option moveid={move.id} key={move.id} value={move.moveName}>
                        {move.moveName}
                      </option>
                    ))
                  }
                </select>
              </fieldset>

              <Counter objType={newBox} />
            </main>
          )
          : <>Loading . . </>
  }
    </>
  ); // return
};
