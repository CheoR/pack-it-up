import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { TextField, Button, ButtonGroup, Box, Paper, Grid, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Image from 'material-ui-image';

import { ItemContext } from './ItemProvider';

const useStyles = makeStyles(() => ({
  paper: {
    background: 'lightgray',
  },
  edit: {
    background: 'lightgreen',
    paddingLeft: '23px',
    paddingRight: '23px',
  },
  delete: {
    background: 'salmon',
  },
  grid: {
    flewGrow: 1,
    gridRowGap: '10px',
    alignItems: 'center',
    borderBottom: '1px solid black',
    marginBottom: '5px',
  },
  column: {
    flexDirection: 'column',
  },
}));

export const ItemSummary = ({ item }) => {
  const classes = useStyles();
  const { deleteItem } = useContext(ItemContext);
  const history = useHistory();

  const handleDelete = (event) => {
    event.preventDefault();
    deleteItem(item.id).then(() => history.push('/items'));
  }; // handleDelete

  return (
    <Box component="section">
      <Paper className={classes.paper}>
        <Grid container className={classes.grid}>
          {/* COLUMN 1 */}
          <Grid item xs={2} className={classes.column} style={{ background: 'pink' }}>
            <Paper>
              <Image
                src={item.imagePath || 'https://via.placeholder.com/300'}
                alt="User-defined"
              />
            </Paper>
          </Grid>
          {/* COLUMN 2 */}
          <Grid item xs={3} className={classes.column} style={{ marginRight: '15px' }}>
            <FormGroup>
              <FormControlLabel
                labelPlacement="start"
                label="Move"
                control={
                  (
                    <Checkbox
                      checked={item.hasAssociatedMove}
                      name="summaryMove"
                      color="default"
                    />
                  )
                }
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                labelPlacement="start"
                label="Box"
                control={
                  (
                    <Checkbox
                      checked={item.hasAssociatedBox}
                      name="summaryBox"
                      color="default"
                    />
                  )
                }
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                labelPlacement="start"
                label="Fragile"
                control={
                  (
                    <Checkbox
                      checked={item.isFragile}
                      name="summaryFragile"
                      color="default"
                    />
                  )
                }
              />
            </FormGroup>
          </Grid>
          {/* COLUMN 3 */}
          <Grid item xs={6} className={classes.column}>
            <form>
              <TextField
                id="itemDescription"
                label="Description"
                defaultValue={`${item.description.substring(0, 13)}. . `}
                inputProps={{
                  readOnly: true,
                  style: {
                    textAlign: 'right',
                  },
                }}
                />
              <TextField
                id="value"
                label="Value"
                defaultValue={`$${item?.value ? item?.value : '0.00'}`}
                inputProps={{
                  readOnly: true,
                  style: {
                    textAlign: 'right',
                  },
                }}
                />
              <ButtonGroup
                color="default"
                aria-label="outlined secondary button group"
                style={{ marginLeft: '5px' }}
              >
                <Button
                  id={`btn--delete-${item?.id}`}
                  className={classes.delete}
                  type="button"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  id={`btn--edit-${item.id}`}
                  className={classes.edit}
                  type="button"
                  component={NavLink}
                  to={`/items/${item.id}`}
                >
                  Edit
                </Button>
              </ButtonGroup>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
