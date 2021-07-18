import { useContext, useEffect } from 'react';

// import { userStorageKey } from '../auth/authSettings';
import { getSum2 } from './helpers';

import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from '../moves/MoveProvider';

export const useFilteredData = () => {
  // const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);

  const { moves, setMoves, addMove, getMovesByUserId } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const aggregateMoveInfo = () => {
    moves.forEach((thisMove) => {
    /*
    Aggregate box/item information per move.
    */
      const boxesForThisMove = boxes.filter((box) => box.moveId === thisMove.id);

      thisMove.totalBoxCount = boxesForThisMove.length;
      thisMove.totalItemsCount = 0;
      thisMove.totalItemsValue = 0;

      boxesForThisMove.forEach((box) => {
        const itemsInBox = items.filter((item) => item.boxId === box.id);

        thisMove.totalItemsCount += itemsInBox.length;
        thisMove.totalItemsValue += getSum2(itemsInBox.filter((item) => item.value || 0));
        box.isFragile = itemsInBox.some((item) => item.isFragile);
      }); // boxesForThisMove.forEach

      /*
      Mark move fragile if any of its boxes are marked fragile.
      Boxes are marked fragile if any of its items are marked fragile.
      */
      thisMove.isFragile = boxesForThisMove.some((thisBox) => thisBox.isFragile);
    }); // moves

    setMoves(moves);
  }; // aggregateMoveInfo

  useEffect(() => {
    getMovesByUserId()
      .then(getBoxesByUserId)
      .then(getItemsByUserId)
      .then(aggregateMoveInfo);
  }, []); // useEffect

  return { moves, boxes, items, addMove };
};
