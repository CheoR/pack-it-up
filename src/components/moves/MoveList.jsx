import React, { useContext, useEffect, useRef, useState } from 'react';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
// import { MoveSummary } from './MoveSummary';
import { MoveContext } from './MoveProvider';
import { BoxContext } from '../boxes/BoxProvider';
import { ItemContext } from '../items/ItemProvider';
// import { Counter } from '../counter/Counter';

// import styles from './moveList.module.css';
import { getSum2 } from '../helpers/helpers';

export const MoveList = () => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const loggedInUserName = sessionStorage.getItem(userStorageUserName);
  const { moves, getMovesByUserId, setMoves, addMove } = useContext(MoveContext);
  const { boxes, getBoxesByUserId } = useContext(BoxContext);
  const { items, getItemsByUserId } = useContext(ItemContext);

  const [isLoading, setIsLoading] = useState(true);
  const [formField, setFormField] = useState({});
  const [setUserInfo] = useState({
    loggedInUserId: 0,
    loggedInUserName: '',
  });

  const inputRef = useRef();

  const aggregateMoveInfo = () => {
    moves.forEach((move) => {
      /*
      Aggregate box/item information per move.
      */
      const boxesForThisMove = boxes.filter((box) => box.moveId === move.id);
      move.totalBoxCount = boxesForThisMove.length;
      move.totalItemsCount = 0;
      move.totalItemsValue = 0;

      boxesForThisMove.forEach((box) => {
        const itemsInBox = items.filter((item) => item.boxId === box.id);
        move.totalItemsCount += itemsInBox.length;
        move.totalItemsValue += getSum2(itemsInBox.filter((item) => item.value || 0));
        box.isFragile = itemsInBox.some((item) => item.isFragile);
      }); // boxesForThisMove.forEach

      /*
        Mark move fragile if any of its boxes are marked fragile.
        Boxes are marked fragile if any of its items are marked fragile.
      */
      move.isFragile = boxesForThisMove.some((thisBox) => thisBox.isFragile);
    }); // moves
    setMoves(moves);
  }; // aggregateMoveInfo

  useEffect(() => {
    setIsLoading(true);
    setUserInfo({
      loggedInUserId,
      loggedInUserName,
    });

    setFormField({
      type: {
        userId: loggedInUserId,
        moveName: 'New Move',
      },
      addObj: addMove,
      resetInputRef: inputRef,
    });
    setIsLoading(false);
  }, []); // useEffect

  useEffect(() => {
    setIsLoading(true);
    const getAllInfo = async () => Promise.all([
      getMovesByUserId(), getBoxesByUserId(), getItemsByUserId()
    ]);

    getAllInfo()
      .then(aggregateMoveInfo)
      .then(() => setIsLoading(false));
  }, []); // useEffect

  /* eslint-disable-next-line */
  const handleControlledInputChange = (event) => {
    /*
      TODO: Form needs to clear aroud after submission.
    */

    const newformField = { ...formField };
    newformField.type[event.target.id] = event.target.value;
    // newformField.type[event.target.id] = inputRef.current.value; // event.target.value
    setFormField(newformField);
  }; // handleControlledInputChange

  if (isLoading) return <div>Loading</div>;
  return (<div>MoveList</div>);
  // return (
  //   <>
  //     {
  //       !isLoading && moves
  //         ? (
  //           <Container>
  //             <Box>
  //               <Typography variant="h4" component="h1" align="center">
  //                 {`${userInfo.loggedInUserName || 'User'}'s Moves`}
  //               </Typography>
  //               {
  //                 moves.map((move) => <MoveSummary key={move.id} move={move} />)
  //               }
  //               <form style={{ align: 'center', alignItems: 'center' }}>
  //                 <FormControl style={{ width: '100%' }}>
  //                   <InputLabel htmlFor="moveName">Move Name</InputLabel>
  //                   <Input
  //                     id="moveName"
  //                     aria-describedby="moveName"
  //                     value={formField.type.moveName}
  //                     onChange={(e) => { handleControlledInputChange(e); }}
  //                   />
  //                   {/* <FormHelperText id="moveName">Move Name</FormHelperText> */}
  //                 </FormControl>
  //               </form>
  //               <Counter objType={formField} />
  //             </Box>
  //           </Container>
  //         )
  //         : (
  //           <Container>
  //             <Box>
  //               <Paper>
  //                 <Typography>
  //                   Loading . . .
  //                 </Typography>
  //               </Paper>
  //             </Box>
  //           </Container>
  //         )
  //         // ? (
  //         //   <main className={styles.summary}>
  //         //     <h1 className={styles.summary__header}>
  //         //       {`${userInfo.loggedInUserName || 'User'}'s Moves`}
  //         //     </h1>
  //         //     {
  //         //       moves.map((move) => <MoveSummary key={move.id} move={move} />)
  //         //     }
  //         //     <form action="" className="summary__form">
  //         //       <fieldset className={styles.summary__formGroup}>
  //         //         <label className={styles.moveNameLabel} htmlFor="moveName">Move Name:
  //         //           <input
  //         //             type="text"
  //         //             id="moveName"
  //         //             name="moveName"
  //         //             ref={inputRef}
  //         //             className={styles.formControl}
  //         //             placeholder="Add Move Name..."
  //         //             // value={formField.type.moveName}
  //         //             onChange={(e) => { handleControlledInputChange(e); }} />
  //         //         </label>
  //         //       </fieldset>
  //         //     </form>
  //         //     <Counter objType={formField} />
  //         //   </main>
  //         // )
  //         // : <>Loading</>
  //     }
  //   </>
  // );
};
