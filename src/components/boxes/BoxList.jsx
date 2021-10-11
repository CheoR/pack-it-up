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
  const { boxes, setBoxes, getBoxesByUserId, addBox } = useContext(BoxContext);
  const { items, setItems, getItemsByUserId } = useContext(ItemContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBox, setNewBox] = useState({});
  const location = useLocation();
  const [selected, setSelected] = useState(moves[0].id);

  useEffect(() => {
    setIsLoading(true);
    getMoves()
      .then(getBoxesByUserId)
      .then(getItemsByUserId)
      .then(() => setIsLoaded(true))
      .then(() => setIsLoading(false));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded) {
      const [movesData, boxesData, itemsData] = [moves, boxes, items].map(
        (type) => type.filter((obj) => obj.userId === loggedInUserId)
      );
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
  }, [isLoaded]); // useEffect

  if (isLoading) return null;

  /*
    Boxes should aggregate information about its contents.
  */

  boxes.forEach((box) => {
    const itemsForThisBox = items.filter((item) => item.boxId === box.id);
    box.totalCount = itemsForThisBox.length;
    box.totalValue = getSum1(itemsForThisBox.map((thisItem) => thisItem.value || 0));
    box.isFragile = itemsForThisBox.some((thisItem) => thisItem.isFragile);
    // box.moveName = box?.move?.moveName;
  }); // boxes.forEach

  const handleControlledDropDownChange = (event) => {
    /*
      moveid - moveId, not option value.
    */
    // const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    // const optionId = event.target.options[selectedIndex].getAttribute('moveid');
    const optionId = event.target.value;
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
      { isLoaded
        ? (
          <section>
            <div>
              <h4>
                {`${loggedInUserName || 'User'}'s Boxes`}
              </h4>
              {
                boxes.map((box) => <BoxSummary key={box.id} box={box} />)
              }
              <form>
                {/* eslint-disable-next-line */}
                <label>Add Boxes To Move</label>
                <select
                  className={styles.select}
                  value={selected}
                  onChange={handleControlledDropDownChange}
                >
                  <option value="" disabled>
                    Moves
                  </option>
                  {
                    moves.map((move) => (
                      <option moveid={move.id} key={move.id} value={move.id}>
                        { move.moveName }
                      </option>
                    ))
                  }
                </select>
              </form>
              <Counter objType={newBox} />
            </div>
          </section>
        )
        : (
          <section>
            <div>
              <div>
                <h4>
                  Loading . . .
                </h4>
              </div>
            </div>
          </section>
        )}
    </>
  ); // return
};
