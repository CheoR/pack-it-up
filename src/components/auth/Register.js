import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authApi, userStorageKey, userStorageUserName } from './authSettings';
import styles from './register.module.css';

export const Register = () => {
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
    .then((user) => !!user.length); /// turn length boolean

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
              // if (createdUser.hasOwnProperty('id')) {
              if (Object.prototype.hasOwnProperty.call(createdUser, 'id')) {
                sessionStorage.setItem(userStorageKey, createdUser.id);
                sessionStorage.setItem(userStorageUserName, createdUser.username);
                history.push('/users');
              }
            });
        } else {
          setConflictDialog(true);
        }
      });
  };

  return (
    <main className={styles.registration}>

      <dialog className={`${styles.dialog} ${styles.dialog__password}`} open={conflictDialog}>
        <div>Account with that email address already exists</div>
        <button type="button" className={styles.button__close} onClick={(e) => { e.preventDefault(); setConflictDialog(false); }}>Close</button>
      </dialog>

      <form className={styles.registration__form__login} onSubmit={handleRegister}>
        <h1 className={styles.registration__header}>Please Register for PackItUp</h1>
        <fieldset className={styles.registration__fieldset}>
          {/* eslint-disable-next-line */}
          <label htmlFor="username"> Username </label>
          <input type="text" name="username" id="username" className={styles.formControl} placeholder="Username" required value={registerUser.username} onChange={handleInputChange} />
        </fieldset>
        <fieldset className={styles.registration__fieldset}>
          {/* eslint-disable-next-line */}
          <label htmlFor="inputEmail"> Email address </label>
          <input type="email" name="email" id="email" className={styles.formControl} placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
        </fieldset>
        <fieldset className={styles.registration__fieldset}>
          {/* eslint-disable-next-line */}
          <label htmlFor="password"> Password </label>
          <input type="password" name="password" id="password" className={styles.formControl} placeholder="Password" required value={registerUser.password} onChange={handleInputChange} />
        </fieldset>
        <fieldset className={styles.registration__fieldset__btn}>
          <button className={styles.registration__btn__submit} type="submit"> Register </button>
        </fieldset>
      </form>
    </main>
  );
};