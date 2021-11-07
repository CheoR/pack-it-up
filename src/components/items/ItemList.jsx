import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../auth/UserProvider';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from './ItemProvider';

import { UserHeader } from '../helpers/UserHeader';
import { Counter } from '../counter/Counter';
import { ItemSummary } from './ItemSummary';

import styles from './itemList.module.css';

export const ItemList = () => {
  const { user } = useContext(UserContext);
  const { items, getItemsByUserId, addItem } = useContext(ItemContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);

  const [dropdownSelection, setDropdownSelection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({});

  const location = useLocation();

  const handleControlledDropDownChange = (event) => {
    /*
    boxid - boxid, not option value.
    if user does not make a selection, select first box by default since
    items can only be created when there is at least one box made.
    */

    const dropdownSelectionIndex = parseInt(event.target.options.dropdownSelectionIndex, 10) || 1;
    const optionId = event.target.options[dropdownSelectionIndex].getAttribute('boxid');
    const updatedItem = { ...newItem };

    setDropdownSelection(parseInt(optionId, 10));
    updatedItem.type.boxId = parseInt(optionId, 10);
    setNewItem(updatedItem);
  }; // handleControlledDropDownChange

  useEffect(() => {
    setIsLoading(true);
    getBoxesByUserId()
      .then(getItemsByUserId)
      .then(() => setIsLoading(false))
      .catch((err) => console.error(`useEffect Error: ${err}`));
  }, []); // useEffect

  useEffect(() => {
    /*
    If user comes from box detail page, assign new items to that box.
    */

    const defaultBoxId = location?.state && location?.state?.box
      ? location.state.box
      : boxes[0]?.id;

    const defaultMoveId = location?.state && location?.state?.box
      ? location.state.box.moveId
      : boxes[0]?.moveId;

    setNewItem({
      type: {
        userId: user.id,
        boxId: defaultBoxId,
        moveId: defaultMoveId,
        description: 'Change Item Description',
        value: 0,
        isFragile: false,
        imagePath: '',
      },
      addObj: addItem,
    }); // setNewItem
  }, [items]);

  if (isLoading) return <>Loading .. . </>;

  items.forEach((item) => {
    item.hasAssociatedBox = !!item.boxId;
    item.hasAssociatedMove = !!item.moveId;
  });

  return (
    <section>
      <UserHeader user={user} text="Items" />
      <ul className={styles.summary}>
        {
          items.map((item) => <ItemSummary key={item.id} item={item} />)
        }
      </ul>
      <fieldset className={styles.container__formGroup}>
        <label className={styles.usersBoxesLabel} htmlFor="usersBoxes">
          Add Items To Box
          <select
            id="usersBoxes"
            className={styles.formControl}
            onChange={handleControlledDropDownChange}
            required
          >
            <option value={dropdownSelection || 0}>
              Select a Box
            </option>
            {
              boxes.map((box) => (
                <option boxid={box.id} key={box.id} value={box.location}>
                  {box.location}
                </option>
              ))
            }
          </select>
        </label>
      </fieldset>
      <Counter objType={newItem} />
    </section>
  );
};
