import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../auth/UserProvider';
import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { ItemContext } from '../items/ItemProvider';

import { UserHeader } from '../helpers/UserHeader';
import { Counter } from '../counter/Counter';
import { BoxSummary } from './BoxSummary';

import { getSum1 } from '../helpers/helpers';

import styles from './boxList.module.css';

export const BoxList = () => {
  const { user } = useContext(UserContext);
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { boxes, getBoxesByUserId, addBox, setBoxes } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const [dropdownSelection, setDropdownSelection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [newBox, setNewBox] = useState({});

  const location = useLocation();

  const aggregateBoxInfo = () => {
    boxes.forEach((box) => {
      const itemsForThisBox = items.filter((item) => item.boxId === box.id);

      box.totalItemsCount = itemsForThisBox.length;
      box.totalItemsValue = getSum1(itemsForThisBox.map((item) => item.value || 0));
      box.isFragile = itemsForThisBox.some((item) => item.isFragile);

      // console.log('box', box.id);
      // console.table(box);
    }); // boxes.forEach
    setBoxes(boxes);
  }; // aggregateBoxInfo

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
    setDropdownSelection(parseInt(optionId, 10));
    updateBox.type.moveId = parseInt(optionId, 10) || newBox.defaultMoveId;
    setNewBox(updateBox);
  }; // handleControlledDropDownChange

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId(user.id)
      .then(getBoxesByUserId(user.id))
      .then(getItemsByUserId(user.id))
      .then(setDropdownSelection(moves[0].id))
      .then(aggregateBoxInfo)
      .then(setIsLoading(false))
      .catch((err) => console.error(`Fetching Error: ${err}`));
  }, []); // useEffect

  useEffect(() => {
    setIsLoading(true);
    /*
      If user comes from move detail page, assign new items to that box.
    */
    const defaultMoveId = location.state && location.state.move
      ? location.state.move
      : moves[0].id;

    setNewBox({
      type: {
        userId: user.id,
        moveId: defaultMoveId,
        location: 'Change Box Location',
        refresh: getBoxesByUserId,
      },
      addObj: addBox,
    }); // setNewBox
    setIsLoading(false);
  }, []);

  if (isLoading) return <>Loading . . </>;

  return (
    <section>
      <UserHeader user={user} text="Boxes" />
      <ul>
        {
          boxes.map((box) => <BoxSummary key={box.id} box={box} />)
        }
      </ul>
      <form>
        {/* eslint-disable-next-line */}
        <label htmlFor="moveSelect">Add Boxes To Move</label>
        <select
          id="moveSelect"
          className={styles.select}
          value={dropdownSelection}
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
    </section>
  );
};
