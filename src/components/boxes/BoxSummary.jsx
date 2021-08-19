import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Button, ButtonGroup, Box, Paper, Grid, Typography, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BoxContext } from './BoxProvider';

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
    gridRowGap: '10px',
    alignItems: 'center',
    borderBottom: '1px solid black',
    marginBottom: '5px',
  },
  formGroup: {
    textAlign: 'center',
  },
}));

export const BoxSummary = ({ box }) => {
  const classes = useStyles();

  const { deleteBox } = useContext(BoxContext);
  const history = useHistory();
  const handleDelete = (event) => {
    event.preventDefault();
    deleteBox(box.id).then(() => history.push('/boxes'));
  }; // handleDelete

  return (
    <Box component="section">
      <Paper className={classes.paper}>
        <Grid container className={classes.grid}>
          <Grid item xs={2} />
          <Grid item xs={3} style={{ marginRight: '26px' }}>
            <FormGroup>
              <FormControlLabel
                style={{ justifyContent: 'space-between' }}
                label="Move"
                labelPlacement="start"
                control={
                  (
                    <Checkbox
                      style={{ marginRight: '55px' }}
                      checked={box.moveId}
                      name="summaryBox"
                      color="default"
                    />
                  )
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              Location
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {`${box.location.substring(0, 5)} . .`}
            </Typography>
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={3}>
            <Typography>
              Value
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {`$${box.totalValue || '0.00'}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              { box?.totalCount } Items
            </Typography>
          </Grid>
          <Grid item>
            <FormGroup>
              <FormControlLabel
                style={{ padding: '0px' }}
                label="Fragile"
                labelPlacement="start"
                control={
                  (
                    <Checkbox
                      checked={box.isFragile}
                      name="summaryBox"
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
                id={`btn--delete-${box.id}`}
                type="button"
                className={classes.delete}
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                className={classes.edit}
                type="button"
                id={`btn--edit-${box.id}`}
                component={NavLink}
                to={`/boxes/${box.id}`}
              >
                Edit
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
