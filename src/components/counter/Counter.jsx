import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    background: 'orange',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '10px',
  },
  btnGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  btnGroup__minus: {
    border: '1px solid black',
    background: 'salmon',
  },
  btnGroup__add: {
    border: '1px solid black',
    background: 'lightgreen',
  },
  btnGroup__display: {
    border: '1px solid black',
  },
  addBtn: {
    border: '1px solid black',
    width: '100%',
  },
}));

export const Counter = ({ objType }) => {
  const classes = useStyles();
  /*
  Counter is object agnostics. It keeps track of user-determined num count and
  calls add function for given object types.

  Component is used as follows:

  <Counter objType={newItem}/>

  Wheere `newItem` is the object type.

  TODO: Add userId to Items table.
  Currently, running json-server with `-w` flag, however objects created
  isn't guarenteed. Using the `-w` creates the correct amount of user-defined
  objects but throws 1ERR_CONNECTION_REFUSED` error since new objects have no assoicated userId.
  */
  const [num, setNum] = useState(1);

  const history = useHistory();
  const location = useLocation();

  const decrementNum = (event) => {
    event.preventDefault();
    if (num) {
      setNum(num - 1);
    } else {
      // counter cannot be negative
      setNum(1);
    }
  }; // decrement

  const incrementNum = (event) => {
    event.preventDefault();
    setNum(num + 1);
  }; // increment

  /* User should not be able to create <= 0 objects */
  if (!num) setNum(1);

  const callAdd = (event) => {
    event.preventDefault();

    const addFuncs = [];

    for (let i = 0; i < num; i += 1) {
      addFuncs.push(objType.addObj);
    }

    Promise.all(addFuncs.map((callback) => callback(objType.type)))
      .then(() => {
        setNum(1);
        /*
        reload/direct to current url since component does not know which component
        url it is being used for.
        */
        return true;
      })
      .then(() => {
        // reset
        try {
          // only used to name moves
          const { resetInputRef } = objType;
          resetInputRef.current.value = '';
        } catch {
          console.log('You cannot name boxes/items this way.');
        } finally {
          history.push(location.pathname);
        }
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  return (
    <Box>
      <Paper className={classes.paper}>
        <Box className={classes.btnGroup} color="default" aria-label="outlined primary button group">
          <Button className={classes.btnGroup__minus} type="button" onClick={decrementNum}>-</Button>
          <Button className={classes.btnGroup__display} value={num} disabled>{ num }</Button>
          <Button className={classes.btnGroup__add} type="button" onClick={incrementNum}>+</Button>
        </Box>
        <Button type="button" className={classes.addBtn} onClick={callAdd}>Add</Button>
      </Paper>
    </Box>
  );
};
