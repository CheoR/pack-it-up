import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import { Button, ButtonGroup, Container, Grid, Checkbox, Box, Paper, Typography, FormControl, Input, FormControlLabel, FormGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from './MoveProvider';
import { BoxContext } from '../boxes/BoxProvider';

const _getSum = (valueList) => {
  /*
  Using .reduce on list of objects ults with incorrect sum values.
  */

  if (!valueList.length) return 0;

  return valueList.reduce((acc, curr) => acc + curr, 0);
};

const useStyles = makeStyles(() => ({
  paper: {
    background: 'lightgray',
  },
  edit: {
    background: 'lightgreen',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  delete: {
    background: 'salmon',
  },
  grid: {
    gridRowGap: '10px',
    alignItems: 'center',
    borderBottom: '1px solid black',
    marginBottom: '5px',
  },
  formGroup: {
    textAlign: 'center',
  },
}));

export const MoveDetail = () => {
  const classes = useStyles();
  const { moveId } = useParams();
  const history = useHistory();

  const { moves, getMoves, updateMove, deleteMove } = useContext(MoveContext);
  const { boxes, getBoxes } = useContext(BoxContext);
  const { items, getItemsByUserId, deleteItem } = useContext(ItemContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [move, setMove] = useState({});
  const [formField, setFormField] = useState({
    moveName: '',
    userId: 0,
    totalValue: 0,
    isFragile: false,
    totalBoxes: 0,
  });

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

  useEffect(() => {
    const getData = async () => {
      // const userMoves = await getMoves();
      // const userBoxes = await getBoxes();
      // const userItems = await getItemsByUserId();
      Promise.all([getMoves, getBoxes, getItemsByUserId])
        .then(() => {
          setIsLoaded(true);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    /*
      Aggregate number of boxes for this move, total value, and if anything is fragile.
    */
    if (isLoaded) {
      const _move = moves.find((m) => m.id === parseInt(moveId, 10));
      const userBoxes = boxes.filter((box) => box.moveId === _move.id);
      const boxIds = userBoxes.map((box) => box.id);
      const userItems = items.filter((item) => boxIds.includes(item.boxId));

      _move.totalBoxes = userBoxes.length;
      // move.totalValue = _getSum(userItems.map((item) => item.value ? item.value : 0));
      _move.totalValue = _getSum(userItems.map((item) => item.value || 0));
      _move.isFragile = userItems.some((item) => item.isFragile);
      setMove(_move);
      setFormField(_move);
    } // if

    if (hasSaved) {
      /* eslint-disable-next-line */
      window.alert('Updated');
    }
  }, [isLoaded, hasSaved]);

  const handleControlledInputChange = (event) => {
    const newformField = { ...formField };
    newformField[event.target.id] = event.target.value;
    setFormField(newformField);
    setHasSaved(false);
  }; // handleControlledInputChange

  const submitUpdate = (event) => {
    event.preventDefault();
    const newformField = { ...formField };

    /*
      Cleanup. Does not belong to ERD.
    */
    delete newformField.user;
    delete newformField.totalValue;
    delete newformField.isFragile;
    delete newformField.totalBoxes;

    updateMove(newformField)
      .then(() => setHasSaved(true));
  }; // updateMove

  if (!formField) return null;

  return (
    <>
      {
        isLoaded
          ? (
            <Container>
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
                      <FormControl>
                        {/* <InputLabel htmlFor="moveValue" labelPlacement="start">
                          Move
                        </InputLabel> */}
                        <Input
                          type="text"
                          id="moveName"
                          name="moveName"
                          aria-describedby="moveName"
                          value={formField.moveName}
                          onChange={(e) => { handleControlledInputChange(e); }}
                        />
                      </FormControl>
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
                      <FormControl>
                        {/* <InputLabel htmlFor="moveValue">
                        </InputLabel> */}
                        <Input
                          type="text"
                          id="moveValue"
                          name="moveValue"
                          aria-describedby="moveValue"
                          value={`$${formField.totalValue ? formField.totalValue : '0.00'}`}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Typography>
                        { move.totalItemsCount } Items
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement="start"
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
                    <Grid item>
                      <ButtonGroup
                        color="default"
                        aria-label="outlined secondary button group"
                        style={{ marginLeft: '15px' }}
                      >
                        <Button
                          id={`btn--delete-${move.id}`}
                          type="button"
                          className={classes.delete}
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                        <Button
                          className={classes.edit}
                          type="button"
                          id={`btn--edit-${move.id}`}
                          component={NavLink}
                          to={`/moves/${move.id}`}
                          onClick={submitUpdate}
                        >
                          Update
                        </Button>
                      </ButtonGroup>
                    </Grid>
                    {/* <Grid xs={3}>
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
                    </Grid> */}
                  </Grid>
                </Paper>
              </Box>
            </Container>
          )
          : (
            <Container className={classes.root}>
              <Box>
                <Paper>
                  <Typography>
                    Loading . . .
                  </Typography>
                </Paper>
              </Box>
            </Container>
          )
        }
    </>
  );
};

// <main className={styles.container}>
//   <form action="" className={styles.container__form}>
//     <fieldset className={styles.container__formGroup}>
//       <label className={styles.moveNameLabel} htmlFor="moveName">Move Name:
//         <input
//           type="text"
//           id="moveName"
//           name="moveName"
//           className={styles.formControl}
//           placeholder="Add Move Name..."
//           value={formField.moveName}
//           onChange={(e) => { handleControlledInputChange(e); }} />
//       </label>
//       <label className={styles.moveNameLabel} htmlFor="moveName">Value:
//         <input
//           type="text"
//           id="moveName"
//           name="moveName"
//           className={styles.formControl}
//           placeholder="Add Move Name..."
//           value={`$${formField.totalValue ? formField.totalValue : '0.00'}`}
//           disabled />
//       </label>

//     <div className={styles.container__value}>Value</div>
//       <div className={styles.container__value__value}>${ formField.totalValue ?
//        formField.totalValue : '0.00' }</div>

//     </fieldset>
//     <div className={styles.container__boxCount}>
//       <div className={styles.container__boxCount__count}>
// { formField.totalBoxes ? formField.totalBoxes : '0' }</div>
//       <div className={styles.container__boxCount__box}>Boxes</div>
//     </div> {/* container__boxCount */}
//     <NavLink
//       className={styles.container__navlink}
//       to={{
//         pathname: '/boxes',
//         state: {
//           move: parseInt(moveId, 10),
//         },
//       }}>
//       <button type="button" id="btn--edit-boxes"
//  className={styles.container__navlinkBtn}>add/update boxes</button>
//     </NavLink>

//     <fieldset className={styles.fragile__checkbox}>
//       <label className={styles.fragie__checkboxLabel} htmlFor="isFragile">Fragile
//         <input type="checkbox" id="isFragile"
//  checked={formField?.isFragile} className={styles.formControl} readOnly />
//       </label>
//     </fieldset>

//     <button className={styles.container__btn__submit}
//  type="submit" onClick={submitUpdate}>Update</button>
//     <button type="button" id={`btn--delete-${move?.id}`}
//  className={styles.container__btn__delete} onClick={handleDelete}>Delete</button>

//   </form>
// </main>
