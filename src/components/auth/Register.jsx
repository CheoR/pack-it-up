/* eslint-disable */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { authApi, userStorageKey, userStorageUserName } from './authSettings';
import styles from './register.module.css';


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
      background: 'lightgreen',
    },
    paper: {
      background: "brown",
      position: "relative",
      marginTop: theme.spacing(2),
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "80%",
      margin: "0 auto",
    },
    grid: {
      background: "pink",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
    },
    form: {
      background: "lightblue",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
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
                <Input id="username" aria-describedby="Create Username" />
                <FormHelperText id="username">Create Username</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="userEmail">Email address</InputLabel>
                <Input id="userEmail" aria-describedby="Your Email" />
                <FormHelperText id="userEmail">Email Address</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="userPassword">Password</InputLabel>
                <Input id="userPassword" aria-describedby="Password" />
                <FormHelperText id="userPassword">Password</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary">
            Register
          </Button>
        </form>
      </Paper>
    </div>
  //   <main className={styles.registration}>
  //     <dialog className={`${styles.dialog} ${styles.dialog__password}`} open={conflictDialog}>
  //       <div>Account with that email address already exists</div>
  //       <button type="button" className={styles.button__close} onClick={() => setConflictDialog(false)}>
  //         Close
  //       </button>
  //     </dialog>
  //     <form className={styles.registration__form__login} onSubmit={handleRegister}>
  //       <h1 className={styles.registration__header}>Register for PackItUp</h1>
  //       <fieldset className={styles.registration__fieldset}>
  //         <label htmlFor="username">Username
  //           <input type="text" name="username" id="username" className={styles.formControl} placeholder="Username" required value={registerUser.username} onChange={handleInputChange} />
  //         </label>
  //       </fieldset>
  //       <fieldset className={styles.registration__fieldset}>
  //         <label htmlFor="inputEmail"> Email address
  //           <input type="email" name="email" id="email" className={styles.formControl} placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
  //         </label>
  //       </fieldset>
  //       <fieldset className={styles.registration__fieldset}>
  //         <label htmlFor="password"> Password
  //           <input type="password" name="password" id="password" className={styles.formControl} placeholder="Password" required value={registerUser.password} onChange={handleInputChange} />
  //         </label>
  //       </fieldset>
  //       <fieldset className={styles.registration__fieldset__btn}>
  //         <button className={styles.registration__btn__submit} type="submit"> Register </button>
  //       </fieldset>
  //     </form>
  //   </main>
  );
};
