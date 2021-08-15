import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Button, Box, Paper, Grid, Typography, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { MoveContext } from './MoveProvider';
import { ItemContext } from '../items/ItemProvider';
import { BoxContext } from '../boxes/BoxProvider';

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
  grid: {
    padding: '5px',
    gridRowGap: '20px',
  },
  formGroup: {
    textAlign: 'center',
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
    <Box component="section">
      <Paper className={classes.paper}>
        <Grid container className={classes.grid}>
          <Grid item xs={6} />
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
              {`$${move.totalItemsValue || '0.00'}`}
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
                  (
                    <Checkbox
                      checked={move.isFragile}
                      name="summaryFragile"
                      color="default"
                    />
                  )
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
  );
};
