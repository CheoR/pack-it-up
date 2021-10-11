import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { authApi } from './authSettings';
import { UserContext } from './UserProvider';

import styles from './register.module.css';

export const Register = () => {
  const { login } = useContext(UserContext);
  const [registerUser, setRegisterUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [conflictDialog, setConflictDialog] = useState(false);

  const history = useHistory();

  const handleInputChange = (event) => {
    const newUser = { ...registerUser };
    newUser[event.target.id] = event.target.value;
    setRegisterUser(newUser);
  };

  const existingUserCheck = () => fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${registerUser.email}`)
    .then((res) => res.json())
    .then((user) => !!user.length);

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
              if (Object.prototype.hasOwnProperty.call(createdUser, 'id')) {
                login(createdUser);
                history.push('/user');
              }
            });
        } else {
          setConflictDialog(true);
        }
      });
  };

  return (
    <main className={styles.registrationPage}>

      <dialog className={styles.dialog} open={conflictDialog}>
        <h3>Could Not Complete Action. Please Try Again.</h3>
        <button type="button" className={styles.button__close} onClick={(e) => { e.preventDefault(); setConflictDialog(false); }}>Close</button>
      </dialog>

      <form className={styles.registrationPage__form} onSubmit={handleRegister}>
        <h1 className={styles.registrationPage__header}>Register</h1>
        <fieldset className={styles.registrationPage__fieldset}>
          {/* eslint-disable-next-line */}
          <label className={styles.registrationPage_label} htmlFor="username"> Username </label>
          <input type="text" name="username" id="username" className={styles.formControl} placeholder="Username" required value={registerUser.username} onChange={handleInputChange} />
        </fieldset>
        <fieldset className={styles.registrationPage__fieldset}>
          {/* eslint-disable-next-line */}
          <label className={styles.registrationPage_label} htmlFor="inputEmail"> Email </label>
          <input type="email" name="email" id="email" className={styles.formControl} placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
        </fieldset>
        <fieldset className={styles.registrationPage__fieldset}>
          {/* eslint-disable-next-line */}
          <label className={styles.registrationPage_label} htmlFor="password"> Password </label>
          <input type="password" name="password" id="password" className={styles.formControl} placeholder="Password" required value={registerUser.password} onChange={handleInputChange} />
        </fieldset>
        <button className={styles.registrationPage__register} type="submit"> Register </button>
      </form>
    </main>
  );
};
