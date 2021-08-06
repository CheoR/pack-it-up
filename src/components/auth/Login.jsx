import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { authApi, userStorageKey } from './authSettings';

import styles from './Login.module.css';

export const Login = () => {
  const [loginUser, setLoginUser] = useState({ email: '' });
  const [existDialog, setExistDialog] = useState(false);

  const history = useHistory();

  const handleInputChange = (event) => {
    const newUser = { ...loginUser };
    newUser[event.target.id] = event.target.value;
    setLoginUser(newUser);
  };

  const existingUserCheck = () => fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${loginUser.email}`)
    .then((res) => res.json())
    .then((user) => (user.length ? user[0] : false)); // existingUserCheck

  const handleLogin = (e) => {
    e.preventDefault();

    existingUserCheck()
      .then((exists) => {
        if (exists) {
          sessionStorage.setItem(userStorageKey, exists.id);
          history.push('/users');
        } else {
          setExistDialog(true);
        }
      });
  };

  return (
    <main className={styles.login_page}>
      <dialog className={`${styles.dialog} ${styles.dialog__auth}`} open={existDialog}>
        <div className={styles.dialog__message}>User does not exist</div>
        <button type="button" className={styles.button__close} onClick={() => setExistDialog(false)}>
          Close
        </button>
      </dialog>
      <form className={styles.login_page__form} onSubmit={handleLogin}>
        <h1 className={styles.login_page__header}>PackItUp</h1>
        <fieldset className={styles.login_page__fieldset}>
          <label className={styles.emailLable} htmlFor="email">Email address
            <input
              type="email"
              id="email"
              className={styles.formControl}
              placeholder="Email address"
              required
              value={loginUser.email}
              onChange={handleInputChange} />
          </label>
        </fieldset>
        <fieldset className={styles.login_page__fieldset__btn}>
          <button className={styles.login_page__btn__submit} type="submit">
            Sign in
          </button>
        </fieldset>
      </form>
      <Link className={styles.login_page__register__link} to="/register">Register for an account</Link>
    </main>
  );
};
