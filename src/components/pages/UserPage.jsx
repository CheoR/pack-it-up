import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import { MoveContext } from '../moves/MoveProvider';

import { UserHeader } from '../helpers/UserHeader';
import { Instructions } from '../helpers/instructions/Instructions';
import { Summary } from '../helpers/summary/Summary';

import { Loading } from '../loading/Loading';

import styles from './userPage.module.css';

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const { moves, getMovesByUserId } = useContext(MoveContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMovesByUserId()
      .then(() => setIsLoading(false));
  }, []); // useEffect

  const usersMoves = {
    type: 'moves',
    canUse: true,
    count: moves.length,
  };

  const totalBoxes = moves.reduce((prev, curr) => prev + curr.boxes.length, 0);

  const usersBoxes = {
    type: 'boxes',
    canUse: !!moves.length,
    count: totalBoxes,
  };

  const totalItems = moves.reduce((prev, curr) => prev + curr.items.length, 0);

  const usersItems = {
    type: 'items',
    canUse: !!totalBoxes,
    count: totalItems,
  };

  const dataToRender = [usersMoves, usersBoxes, usersItems];

  if (isLoading) return <Loading />;

  return (
    <main className={styles.userPage}>
      <UserHeader user={user} text="Summary" />
      <Instructions />
      <Summary listOfTypes={dataToRender} />
    </main>
  );
};
