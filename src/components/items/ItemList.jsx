import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from './ItemProvider';
import { ItemSummary } from './ItemSummary';
import { Counter } from '../counter/Counter';
import styles from './itemList.module.css';

export const ItemList = () => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const loggedInUserName = sessionStorage.getItem(userStorageUserName);
  const { items, getItems, addItem } = useContext(ItemContext);
  const { boxes, setBoxes, getBoxes } = useContext(BoxContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectionMade, setSelectionMade] = useState(false);
  const [newItem, setNewItem] = useState({});
  const location = useLocation();

  useEffect(() => {
    getBoxes()
      .then(getItems)
      .then(() => setIsLoaded(true))
      .then(() => setSelectionMade(false));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded) {
      /*
        So following references to boxes only pertain to those linked to logged in user.
      */
      const userBoxes = boxes.filter((box) => box.userId === loggedInUserId);
      setBoxes(userBoxes);

      /*
      If user comes from box detail page, assign new items to that box.
      */

      const defaultBoxId = location.state && location.state.box
        ? location.state.box
        : userBoxes[0].id;

      setNewItem({
        type: {
          userId: loggedInUserId,
          boxId: defaultBoxId,
          description: 'Change Item Description',
          value: 0,
          isFragile: false,
          imagePath: '',
        },
        addObj: addItem,
      }); // setNewIte
    } // if
  }, [isLoaded, selectionMade]);

  const itemsData = items.filter((item) => item.userId === loggedInUserId);

  itemsData.forEach((item) => {
    /*
      item.hasAssociatedBox = item.boxId ? true : false
      item.hasAssociatedMove = item?.box.moveId ? true : false
      Neat way to turn number into a boolean
    */
    item.hasAssociatedBox = !!item.boxId;
    item.hasAssociatedMove = !!item?.box?.moveId;
  });

  const handleControlledDropDownChange = (event) => {
  /*
    boxid - boxid, not option value.
    if user does not make a selection, select first box by default since
    items can only be created when there is at least one box made.
  */

    const selectedIndex = parseInt(event.target.options.selectedIndex, 10) || 1;
    const optionId = event.target.options[selectedIndex].getAttribute('boxid');
    const updatedItem = { ...newItem };

    updatedItem.type.boxId = parseInt(optionId, 10);
    setNewItem(updatedItem);
    setSelectionMade(true);
  }; // handleControlledDropDownChange

  if (!isLoaded) return null;
  return (
    <>
      {
        isLoaded
          ? (
            <>
              <main className={styles.summary}>
                <h1 className={styles.summary__header}>`${loggedInUserName}&aposs Items`</h1>
                {
                  itemsData.map((item) => <ItemSummary key={item.id} item={item} />)
                }
                <fieldset className={styles.container__formGroup}>
                  {/* eslint-disable-next-line */}
                  <label className={styles.usersBoxesLabel} htmlFor='usersBoxes'>Box Selection</label>
                  {/*
                    Adding value={boxes[0]?.id} always renders with the default value.
                  */}
                  <select id="usersBoxes" className={styles.formControl} onChange={handleControlledDropDownChange} required>
                    <option value="0">Select a box</option>
                    {
                      boxes.map((box) => (
                        <option boxid={box.id} key={box.id} value={box.location}>
                          {box.location}
                        </option>
                      ))
                    }
                  </select>
                </fieldset>
                <Counter objType={newItem} />
              </main>
            </>

          )
          : <> Loading  .. . </>
      }
    </>
  );
};
