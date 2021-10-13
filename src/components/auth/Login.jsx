import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { authApi } from './authSettings';
import { UserContext } from './UserProvider';

import styles from './login.module.css';

export const Login = () => {
  const { login } = useContext(UserContext);
  const [formFields, setFormFields] = useState({ email: '' });
  const [existDialog, setExistDialog] = useState(false);

  const history = useHistory();

  const handleInputChange = (event) => {
    const newForm = { ...formFields };
    newForm[event.target.id] = event.target.value;
    setFormFields(newForm);
  };

  const existingUserCheck = () => fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${formFields.email}`)
    .then((res) => res.json())
    .then((user) => (user.length ? user[0] : false))
    .catch((err) => console.error(`User Not Found: ${err}`));

  const handleLogin = (e) => {
    e.preventDefault();

    existingUserCheck()
      .then((userExists) => {
        if (userExists) {
          login(userExists);
          history.push('/user');
        } else {
          setExistDialog(true);
        }
      });
  };

  return (
    <main className={styles.loginPage}>
      <dialog className={styles.dialog} open={existDialog}>
        <h3>User does not exist</h3>
        <button type="button" className={styles.button__close} onClick={(e) => { e.preventDefault(); setExistDialog(false); }}><h3>Close</h3></button>
      </dialog>
      <form className={styles.loginPage__form} onSubmit={handleLogin}>
        <h1 className={styles.loginPage__header}>PackItUp</h1>
        <fieldset className={styles.loginPage__fieldset}>
          {/* eslint-disable-next-line */}
          <label className={styles.loginPage_label} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={styles.loginPage__formControl}
            placeholder="Email address"
            required
            value={formFields.email}
            onChange={handleInputChange} />
        </fieldset>
        <button className={styles.loginPage__signIn} type="submit">
          Sign in
        </button>
      </form>
      <section className={styles.loginPage__register}>
        <Link to="/register">Register for an account</Link>
      </section>
    </main>
  );
};
