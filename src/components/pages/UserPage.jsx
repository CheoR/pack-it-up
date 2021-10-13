import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';

import { Instructions } from '../helpers/instructions/Instructions';
import { Summary } from '../helpers/summary/Summary';

import styles from './userPage.module.css';
import { UserHeader } from '../helpers/UserHeader';

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const { moves, getMovesByUserId } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId(user.id)
      .then(getBoxesByUserId(user.id))
      .then(getItemsByUserId(user.id))
      .then(() => setIsLoading(false));
  }, []); // useEffect

  const usersMoves = {
    type: 'moves',
    canUse: true,
    count: moves.length,
  };

  const usersBoxes = {
    type: 'boxes',
    canUse: !!moves.length,
    count: boxes.length,
  };

  const usersItems = {
    type: 'items',
    canUse: !!boxes.length,
    count: items.length,
  };

  const dataToRender = [usersMoves, usersBoxes, usersItems];

  if (isLoading) return null;

  return (
    <main className={styles.userPage}>
      <UserHeader user={user} text="Summary" />
      <Instructions />
      <Summary listOfTypes={dataToRender} />
    </main>
  );
};
