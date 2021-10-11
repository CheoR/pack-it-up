// eslint-disable

import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { MoveContext } from './MoveProvider';
import { ItemContext } from '../items/ItemProvider';
import { BoxContext } from '../boxes/BoxProvider';

// import styles from './moveSummary.module.css';

export const MoveSummary = ({ move }) => {
  const { deleteMove } = useContext(MoveContext);
  const { boxes } = useContext(BoxContext);
  const { items, deleteItem } = useContext(ItemContext);

  const history = useHistory();

  /* eslint-disable-next-line */
  const handleDelete = (event) => {
    event.preventDefault();

    /*
      json-server only deletes boxes linked to current move and not thier associated items.
      So delete associated items first (if any) before delete move and boxes.
    */
    // deleteMove(move?.id).then(() => history.push('/moves'))

    const linkedBoxesIds = boxes.filter((box) => box.moveId === move.id).map((box) => box.id);
    const linkedItemsIds = items.filter((item) => linkedBoxesIds.includes(
      item.boxId
    )).map((item) => item.id);

    if (linkedItemsIds.length) {
      const addFuncs = [];

      for (let i = 0; i < linkedItemsIds.length; i += 1) {
        addFuncs.push(deleteItem);
      }

      /*
        Delete items before deleing given move.
      */
      Promise.all(addFuncs.map((callback, idx) => callback(linkedItemsIds[idx])))
        .then(() => {
          deleteMove(move?.id).then(() => history.push('/moves'));
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
        });
    } else {
      deleteMove(move?.id).then(() => history.push('/moves'));
    }
  }; // handleDelete

  return (<div>MoveSumary</div>);

  // return (
  //   <Box component="section">
  //     <Paper className={styles.paper}>
  //       <Grid container className={styles.grid}>
  //         <Grid item xs={6} />
  //         <Grid item xs={3}>
  //           <Typography>
  //             Move
  //           </Typography>
  //         </Grid>
  //         <Grid item xs={3}>
  //           <Typography>
  //             { `${move.moveName.substring(0, 5)} . .` }
  //           </Typography>
  //         </Grid>
  //         <Grid item xs={6}>
  //           <Typography>
  //             { move.totalBoxCount } Boxes
  //           </Typography>
  //         </Grid>
  //         <Grid item xs={3}>
  //           <Typography>
  //             Value
  //           </Typography>
  //         </Grid>
  //         <Grid item xs={3}>
  //           <Typography>
  //             {`$${move.totalItemsValue || '0.00'}`}
  //           </Typography>
  //         </Grid>
  //         <Grid item>
  //           <Typography>
  //             { move.totalItemsCount } Items
  //           </Typography>
  //         </Grid>
  //         <Grid item>
  //           <FormGroup>
  //             <FormControlLabel
  //               label="Fragile"
  //               labelPlacement="start"
  //               control={
  //                 (
  //                   <Checkbox
  //                     checked={move.isFragile}
  //                     name="summaryFragile"
  //                     color="default"
  //                   />
  //                 )
  //               }
  //             />
  //           </FormGroup>
  //         </Grid>
  //         <Grid item>
  //           <ButtonGroup
  //             color="default"
  //             aria-label="outlined secondary button group"
  //             style={{ marginLeft: '15px' }}
  //           >
  //             <Button
  //               id={`btn--delete-${move.id}`}
  //               type="button"
  //               className={styles.delete}
  //               onClick={handleDelete}
  //             >
  //               Delete
  //             </Button>
  //             <Button
  //               className={styles.edit}
  //               type="button"
  //               id={`btn--edit-${move.id}`}
  //               component={NavLink}
  //               to={`/moves/${move.id}`}
  //             >
  //               Edit
  //             </Button>
  //           </ButtonGroup>
  //         </Grid>
  //       </Grid>
  //     </Paper>
  //   </Box>
  // );
};
