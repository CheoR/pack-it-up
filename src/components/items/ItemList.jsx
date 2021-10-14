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

  const [isLoading, setIsLoading] = useState(false);
  const [selectionMade, setSelectionMade] = useState(false);
  const [newItem, setNewItem] = useState({});

  const location = useLocation();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getBoxesByUserId(user.id)
      .then(getItemsByUserId(user.id))
      .then(() => setSelectionMade(false))
      .then(() => setIsLoading(false));
  }, []); // useEffect

  useEffect(() => {
    /*
    If user comes from box detail page, assign new items to that box.
    */

    const defaultBoxId = location.state && location.state.box
      ? location.state.box
      : boxes[0].id;

    setNewItem({
      type: {
        userId: user.id,
        boxId: defaultBoxId,
        description: 'Change Item Description',
        value: 0,
        isFragile: false,
        imagePath: '',
      },
      addObj: addItem,
      refresh: getItemsByUserId,
    }); // setNewItem
  }, [selectionMade]);

  const itemsData = items.filter((item) => item.userId === user.id);

  /* eslint-disable no-param-reassign */
  itemsData.forEach((item) => {
    /*
    item.hasAssociatedBox = item.boxId ? true : false
    item.hasAssociatedMove = item?.box.moveId ? true : false
    Neat way to turn number into a boolean
    */
    item.hasAssociatedBox = !!item.boxId;
    item.hasAssociatedMove = !!item?.box?.moveId;
  });

  /* eslint-disable-next-line */
  const handleControlledDropDownChange = (event) => {
    /*
    boxid - boxid, not option value.
    if user does not make a selection, select first box by default since
    items can only be created when there is at least one box made.
    */

    const selectedIndex = parseInt(event.target.options.selectedIndex, 10) || 1;
    const optionId = event.target.options[selectedIndex].getAttribute('boxid');
    // const optionId = event.target.value;
    const updatedItem = { ...newItem };

    console.log('option id: ', optionId);
    setSelected(parseInt(optionId, 10));
    updatedItem.type.boxId = parseInt(optionId, 10);
    setNewItem(updatedItem);
    setSelectionMade(true);
  }; // handleControlledDropDownChange

  if (isLoading) return <>Loading .. . </>;

  return (
    <section className={styles.summary}>
      <UserHeader user={user} text="Items" />
      <ul>
        {
          itemsData.map((item) => <ItemSummary key={item.id} item={item} />)
        }
      </ul>
      <fieldset className={styles.container__formGroup}>
        <label className={styles.usersBoxesLabel} htmlFor="usersBoxes">Box Selection
          {/*
          Adding value={boxes[0]?.id} always renders with the default value.
          */}
          <select id="usersBoxes" className={styles.formControl} onChange={handleControlledDropDownChange} required>
            <option value={selected || 0}>Select a box</option>
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
