import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { authApi, userStorageKey, userStorageUserName } from './authSettings';

export const Register = () => {
  const useStyles = makeStyles((theme) => ({
    main: {
      height: '75vh',
      marginBottom: theme.spacing(2),
    },
    paper: {
      position: 'relative',
      marginTop: theme.spacing(2),
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '80%',
      margin: '0 auto',
      border: '1px solid black',
    },
    grid: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  }));

  const [registerUser, setRegisterUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const history = useHistory();

  const handleInputChange = (event) => {
    const newUser = { ...registerUser };
    newUser[event.target.id] = event.target.value;
    setRegisterUser(newUser);
  };

  const existingUserCheck = () => fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${registerUser.email}`)
    .then((res) => res.json())
    .then((user) => !!user.length); /// turn length into boolean

  const handleRegister = (e) => {
    e.preventDefault();

    existingUserCheck()
      .then((userExists) => {
        if (!userExists) {
          fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: `${registerUser.username}`,
              email: registerUser.email,
              password: `${registerUser.password}`,
            }),
          })
            .then((res) => res.json())
            .then((createdUser) => {
              if (Object.hasOwnProperty.call(createdUser, 'id')) {
              // if (createdUser.hasOwnProperty('id')) {
                sessionStorage.setItem(userStorageKey, createdUser.id);
                sessionStorage.setItem(userStorageUserName, createdUser.username);
                history.push('/users');
              }
            });
        }
      });
  };

  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography varient="h1" component="h1">
          Register
        </Typography>
        <form onSubmit={handleRegister} className={classes.form}>
          <Grid container className={classes.grid}>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  aria-describedby="Create Username"
                  onChange={handleInputChange}
                />
                <FormHelperText id="username">Create Username</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="email">Email address</InputLabel>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  aria-describedby="Your Email"
                  onChange={handleInputChange}
                />
                <FormHelperText id="email">Email Address</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  aria-describedby="Password"
                  onChange={handleInputChange}
                />
                <FormHelperText id="password">Password</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </form>
      </Paper>
    </div>
  );
};
