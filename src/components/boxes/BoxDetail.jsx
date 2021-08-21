import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';

import { Button, ButtonGroup, Container, Grid, Box, Paper, Typography, FormControl, Input, FormGroup, FormControlLabel, Checkbox, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Image from 'material-ui-image';

import { userStorageKey } from '../auth/authSettings';
import { ItemContext } from '../items/ItemProvider';
import { MoveContext } from '../moves/MoveProvider';
import { BoxContext } from './BoxProvider';
import { getSum3 } from '../helpers/helpers';

const useStyles = makeStyles(() => ({
  paper: {
    background: 'lightgray',
  },
  update: {
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
  edit: {
    minWidth: '100%',
    margin: '25px 0',
  },
  view: {
    minWidth: '100%',
  },
}));

export const BoxDetail = () => {
  const classes = useStyles();
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const { moves, setMoves, getMoves } = useContext(MoveContext);
  const { boxes, getBoxesByUserId, updateBox, deleteBox } = useContext(BoxContext);
  const { items, setItems, getItemsByUserId } = useContext(ItemContext);
  const [formField, setFormField] = useState({
    userId: loggedInUserId,
    moveId: 0,
    location: '',
    qrCode: '',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [selected, setSelected] = useState('');
  const [box, setBox] = useState({});
  const { boxId } = useParams();
  const history = useHistory();

  useEffect(() => {
    getMoves()
      .then(getBoxesByUserId)
      .then(getItemsByUserId)
      .then(() => setIsLoaded(true));
  }, []); // useEffect

  useEffect(() => {
    if (isLoaded && boxes) {
      const _box = boxes.find((thisBox) => thisBox?.id === parseInt(boxId, 10));
      setBox(_box);
      _box.move = moves.find((thisMove) => thisMove?.id === _box.moveId);
      setMoves(moves.filter((move) => move?.userId === loggedInUserId));
      setItems(items.filter((item) => item?.boxId === _box?.id));

      setSelected(_box.move.moveName);
      setFormField({
        id: _box?.id,
        userId: loggedInUserId,
        moveId: _box?.moveId,
        location: _box?.location,
        qrCode: '',
      });
    } // if

    if (hasSaved) {
      window.alert('Updated');
    }
  }, [boxes, isLoaded]);

  if (box) {
    box.totalItems = items?.length;
    box.totalValue = getSum3(items.map((item) => item?.value || 0));
    box.isFragile = items.some((item) => item?.isFragile);
  }

  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(box?.id).then(() => history.push('/boxes'));
  };

  const handleControlledDropDownChange = (event) => {
    const newformField = { ...formField };
    newformField[event.target.id] = event.target.value;

    // console.log(`
    //   targetValue: ${event.target.value}
    //   ======
    //   targetOptions: ${event.target.options}
    //   ======
    //   targetOptionsSelectedIndex: ${event.target.options.selectedIndex}
    // `)
    const selectedIndex = parseInt(event.target.options.selectedIndex, 10);
    const optionId = event.target.options[selectedIndex].getAttribute('boxid');

    /*
      Default 1st move if no selection made.
      No select results in praseInt(optionId) is null.
    */
    setSelected(event.target.value);
    newformField.moveId = parseInt(optionId, 10) || moves[0].id;
    setFormField(newformField);
    setHasSaved(false);
  }; // handleControlledInputChange

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
    delete newformField.usersMoves;
    updateBox(newformField);
    setHasSaved(true);
  }; // updateMove

  return (
    <>
      {
        isLoaded
          ? (
            <Container>
              <Paper className={classes.paper}>
                <Image
                  src={`https://source.unsplash.com/featured/?${box?.location}`}
                  alt={`${box?.location}`}
                />
                <form>
                  <Grid container>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                      <Typography style={{ height: '100%', display: 'flex', align: 'center', justifyContent: 'center' }}>
                        Location
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl>
                        <Input
                          type="text"
                          id="location"
                          name="location"
                          aria-describedby="location"
                          value={formField.location}
                          onChange={(e) => { handleControlledInputChange(e); }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                      <Typography style={{ height: '100%', display: 'flex', align: 'center', justifyContent: 'center' }}>
                        Value
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl>
                        <Input
                          type="text"
                          id="value"
                          name="value"
                          aria-describedby="value"
                          value={`$${box?.totalValue || '0.00'}`}
                          onChange={(e) => { handleControlledInputChange(e); }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                      <Typography style={{ height: '100%', display: 'flex', align: 'center', justifyContent: 'center' }}>
                        Move
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Select value={selected} onChange={handleControlledDropDownChange}>
                          <MenuItem value="" disabled>
                            Moves
                          </MenuItem>
                          {
                            moves.map((move) => (
                              <MenuItem boxid={move.id} key={move.id} value={move.id}>
                                { move.moveName }
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Typography>
                        { box?.totalItems } Items
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
                                checked={box.isFragile}
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
                        style={{ marginLeft: '5px' }}
                      >
                        <Button
                          className={classes.delete}
                          id={`btn--delete-${box?.id}`}
                          type="button"
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                        <Button
                          className={classes.update}
                          type="submit"
                          onClick={submitUpdate}
                        >
                          Update
                        </Button>
                      </ButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        className={classes.edit}
                        variant="contained"
                        id="btn--edit-items"
                        type="button"
                        component={NavLink}
                        to={{
                          pathname: '/items',
                          state: {
                            box: parseInt(boxId, 10),
                          },
                        }}
                      >
                        add/update items
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        className={classes.view}
                        variant="contained"
                        id="btn--viewMove"
                        type="button"
                        component={NavLink}
                        to={{
                          pathname: `/moves/${box?.moveId}`,
                        }}
                      >
                        view move
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          )
          : (
            <Container>
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
