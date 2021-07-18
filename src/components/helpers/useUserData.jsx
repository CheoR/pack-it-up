import { useContext, useEffect, useState } from 'react';

// import { userStorageKey, userStorageUserName } from '../auth/authSettings';

import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from '../moves/MoveProvider';

import { getSum2 } from './helpers';

export const useUserData = () => {
  const { moves, getMovesByUserId, addMove } = useContext(MoveContext);
  const { boxes, getBoxesByUserId, addBox } = useContext(BoxContext);
  const { items, getItemsByUserId, addItem } = useContext(ItemContext);

  const [pendingData, setPendingData] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(
    {
      type: {
        move: moves || [],
        box: boxes || [],
        item: items || [],
      },
      add: {
        move: addMove,
        box: addBox,
        item: addItem,
      },
    }
  );

  useEffect(() => {
    setPendingData(true);

    const _fetchData = async () => {
      const _moves = getMovesByUserId();
      const _boxes = getBoxesByUserId();
      const _items = getItemsByUserId();
      return Promise.all([_moves, _boxes, _items]);
    }; // _fetchData

    const _aggregateMoveInfo = (values) => {
      const _moves = values[0];
      const _boxes = values[1];
      const _items = values[2];

      _moves.forEach((move) => {
        /*
        Aggregate box/item information per move.
        */
        const boxesForThisMove = _boxes.filter((box) => box.moveId === move.id);

        move.totalBoxCount = boxesForThisMove.length;
        move.totalItemsCount = 0;
        move.totalItemsValue = 0;

        boxesForThisMove.forEach((box) => {
          const itemsInBox = _items.filter((item) => item.boxId === box.id);
          move.totalItemsCount += itemsInBox.length;
          move.totalItemsValue += getSum2(itemsInBox.filter((item) => item.value || 0));
          box.isFragile = itemsInBox.some((item) => item.isFragile);
        }); // boxesForThisMove.forEach

        /*
          Mark move fragile if any of its boxes are marked fragile.
          Boxes are marked fragile if any of its items are marked fragile.
        */
        move.isFragile = boxesForThisMove.some((thisBox) => thisBox.isFragile);
      }); // _moves
      return { _moves, _boxes, _items };
    }; // _aggregateMoveInfo

    const _setData = ({ _moves, _boxes, _items }) => {
      setData({
        type: {
          move: _moves,
          box: _boxes,
          item: _items,
        },
        add: {
          move: addMove,
          box: addBox,
          item: addItem,
        },
      }); // setData
    }; // _setData

    _fetchData()
      .then(() => _aggregateMoveInfo)
      .then(() => _setData)
      .catch((err) => {
        console.table(err);
        setError(err);
      })
      .finally(() => setPendingData(false));
  }, []); // useEffect

  return [data, pendingData, setPendingData, error];
}; // useUserData
