/* eslint-disable */

import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Button, Box, Paper, Grid, Typography, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { MoveContext } from './MoveProvider';
import { ItemContext } from '../items/ItemProvider';
import { BoxContext } from '../boxes/BoxProvider';

// import styles from './moveSummary.module.css';


const useStyles = makeStyles(() => ({
  paper: {
    background: 'lightgray',
  },
  edit: {
    background: 'lightgreen',
  },
  delete: {
    background: 'salmon',
  },
  topRow: {
    background: 'lightblue',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    justifyContent: 'space-between',
  },
  grid: {
    padding: '10px',
  },
  formGroup: {
    textAlign: 'center',
    // border: '1px solid black',
  },
}));

export const MoveSummary = ({ move }) => {
  const classes = useStyles();

  const { deleteMove } = useContext(MoveContext);
  const { boxes } = useContext(BoxContext);
  const { items, deleteItem } = useContext(ItemContext);

  const history = useHistory();

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

  return (
    <Box>
      <Paper className={classes.paper}>
        <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={6}>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              Move
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              { `${move.moveName.substring(0, 5)} . .` }
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              { move.totalBoxCount } Boxes
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              Value
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {`$${ move.totalItemsValue || '0.00' }`}
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography>
              { move.totalItemsCount } Items
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <FormGroup row className={classes.formGroup}>
              <FormControlLabel
                label="Fragile"
                control={
                  <Checkbox
                  checked={move.isFragile}
                  name="summaryFragile"
                  color="default"
                  />
                }
              />
            </FormGroup>
          </Grid>
          <Grid xs={3}>
            <Button
              id={`btn--delete-${move.id}`}
              type="button"
              className={classes.delete}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
          <Grid xs={3}>
            <Button
              className={classes.edit}
              type="button"
              id={`btn--edit-${move.id}`}
              component={NavLink}
              to={`/moves/${move.id}`}
            >
              Edit
            </Button>
          </Grid>
        </Grid>

      </Paper>
    </Box>
    // <section className={styles.summary}>

    //   <div className={styles.summary__move}>Move</div>
    //   <div className={styles.summary__move__move}>{ `${move.moveName.substring(0, 5)} . .` }</div>

    //   <div className={styles.summary__value}>Value</div>
    //   <div className={styles.summary__value__value}>${ move.totalItemsValue || '0.00' }</div>

    //   <div className={styles.summary__boxCount}>
    //     <div className={styles.summary__boxCount__count}>{ move.totalBoxCount }</div>
    //     <div className={styles.summary__boxCount__box}>Boxes</div>
    //   </div> {/* summary__boxCount */}



    //   <div className={styles.summary__itemCount}>
    //     <div className={styles.summary__itemCount__count}>{ move.totalItemsCount }</div>
    //     <div className={styles.summary__itemCount__item}>Items</div>
    //   </div> {/* summary__itemCount */}

    //   <fieldset className={styles.fragile__checkbox}>
    //     <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">Fragile</label>
    //     <input type="checkbox" name="summaryFragile" id="summaryFragile" checked={move.isFragile}
    //      className={styles.formControl} readOnly />
    //   </fieldset>

    //   <fieldset className={styles.fragile__checkbox}>
    //     <label className={styles.fragile__checkboxLabel} htmlFor="summaryFragile">
    //       Fragile
    //       <input type="checkbox" name="summaryFragile" id="summaryFragile" checked={move.isFragile} className={styles.formControl} readOnly />
    //     </label>
    //   </fieldset>

    // </section>
  );
};
