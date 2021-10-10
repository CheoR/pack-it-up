import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { authApi, userStorageKey, userStorageUserName } from './authSettings';
// import { UserContext } from '../users/UserProvider';

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

export const Login = () => {
  console.log('LOGIN.JSX');

  const classes = useStyles();

  // const { users, getUsers } = useContext(UserContext);
  // const { getUser, getUserById } = useContext(UserContext);
  const [loginUser, setLoginUser] = useState({ email: '' });
  const history = useHistory();

  const handleInputChange = (event) => {
    const newUser = { ...loginUser };
    newUser[event.target.id] = event.target.value;
    setLoginUser(newUser);
  };

  const existingUserCheck = () => fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${loginUser.email}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((res) => {
      console.log('res');
      console.table(res);
      return res.json();
    })
    .then((user) => {
      console.log('user');
      console.table(user);
      return (user.length ? user[0] : false);
    }); // existingUserCheck, user[0] : user object

  const handleLogin = (e) => {
    e.preventDefault();
    existingUserCheck()
      .then((userObj) => {
        if (userObj) {
          sessionStorage.setItem(userStorageUserName, userObj.username);
          sessionStorage.setItem(userStorageKey, userObj.id);
          history.push('/users');
        }
      })
      .catch((err) => {
        console.error(`Setting Error: ${err.message}`);
        history.push('/login');
      });
  }; // handleLogin

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography varient="h1" component="h1">
          Login
        </Typography>
        <form onSubmit={handleLogin} className={classes.form}>
          <Grid container className={classes.grid}>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="username">User Email</InputLabel>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  aria-describedby="email"
                  onChange={handleInputChange}
                  required
                />
                <FormHelperText id="email">User Email</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
          >
            Login
          </Button>
        </form>
        <Button
          variant="outlined"
          color="default"
          component={Link}
          to="/register"
        >
          Register for an account
        </Button>
      </Paper>
    </div>
    // <main className={styles.login_page}>
    //   <dialog className={`${styles.dialog} ${styles.dialog__auth}`} open={existDialog}>
    //     <div className={styles.dialog__message}>User does not exist</div>
    //     <button type="button" className={styles.button__close} onClick={
    //  () => setExistDialog(false)}>
    //       Close
    //     </button>
    //   </dialog>
    //   <form className={styles.login_page__form} onSubmit={handleLogin}>
    //     <h1 className={styles.login_page__header}>PackItUp</h1>
    //     <fieldset className={styles.login_page__fieldset}>
    //       <label className={styles.emailLable} htmlFor="email">Email address
    //         <input
    //           type="email"
    //           id="email"
    //           className={styles.formControl}
    //           placeholder="Email address"
    //           required
    //           value={loginUser.email}
    //           onChange={handleInputChange} />
    //       </label>
    //     </fieldset>
    //     <fieldset className={styles.login_page__fieldset__btn}>
    //       <button className={styles.login_page__btn__submit} type="submit">
    //         Sign in
    //       </button>
    //     </fieldset>
    //   </form>
    //   <Link className={styles.login_page__register__link} to="/register">
    //  Register for an account</Link>
    // </main>
  );
};
