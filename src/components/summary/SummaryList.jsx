import React, { useContext, useEffect } from 'react';

import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { Summary } from './Summary';
import { Instructions } from '../helpers/instructions/Instructions';
import logo from '../../assets/images/PackItUpLogo.png';
import styles from './summaryList.module.css';

export const SummaryList = () => {
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const loggedInUserId = parseInt(sessionStorage.getItem('app_user_id'), 10);
  const loggedInUsername = sessionStorage.getItem('app_user_username');

  useEffect(() => {
    getMovesByUserId()
      .then(getBoxesByUserId)
      .then(getItemsByUserId);
  }, []); // useEffect

  const usersMoves = {
    type: 'moves',
    canUse: false,
    collection: moves,
  };

  const usersBoxes = {
    type: 'boxes',
    canUse: !!usersMoves.collection.length,
    collection: !!boxes.filter((box) => box.userId === loggedInUserId),
  };

  const usersItems = {
    type: 'items',
    canUse: !!usersBoxes.collection.length,
    collection: items.filter((item) => item.userId === loggedInUserId),
  };

  const dataToRender = [usersMoves, usersBoxes, usersItems];

  return (
    <div className={styles.summaryList}>
      {/* <img src={logo} className={styles.summaryList__logo} alt='Pack It Up Logo'/>
      <h1 className={styles.summaryList__header}>{ loggedInUsername }'s Summary</h1> */}

      <div className={styles.summaryList__headerbox}>
        <img src={logo} className={styles.summaryList__logo} alt="Pack It Up Logo" />
        <h1 className={styles.summaryList__header}>{ loggedInUsername }&quot;s Summary</h1>
      </div>
      <Instructions />
      <Summary listOfTypes={dataToRender} />
    </div>
  );
};
