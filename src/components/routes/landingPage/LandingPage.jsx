import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, makeStyles, Typography } from '@material-ui/core';

import { Instructions } from '../../helpers/instructions/Instructions';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'lightblue',
  },
  fig: {
    width: '100%',
  },
  img: {
    width: '100%',
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export const LandingPage = () => {
  const classes = useStyles();

  return (
    <Container>
      <main className={classes.root}>
        <Typography variant="h2" component="h2" color="textPrimary" align="center" gutterBottom>
          PackItUp
        </Typography>
        <figure className={classes.fig}>
          <img className={classes.img} src="https://images.unsplash.com/photo-1603861609805-29b5fda4a585?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2140&q=80" alt="Labelled boxes" />
        </figure>
        <Typography variant="h4" component="h2" color="textSecondary" align="center" gutterBottom>
          track what you pack, app
        </Typography>
        <Typography variant="body1" component="p" color="textSecondary" align="center" gutterBottom>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Non voluptatum voluptates libero officia repellendus quod accusantium
          delectus asperiores deleniti.
        </Typography>
        <div className={classes.btnGroup}>
          <ButtonGroup
            orientation="horizontal"
            color="primary"
            aria-label="horizontal contained primary button group"
            variant="contained"
          >
            <Button component={Link} to="/register">Register</Button>
            <Button component={Link} to="/login">Login</Button>
          </ButtonGroup>
        </div>
        <Instructions />
      </main>
    </Container>
  );
};
