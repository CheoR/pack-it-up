import React from 'react';
import { Link } from 'react-router-dom';
import { Instructions } from '../../helpers/instructions/Instructions';
import styles from './landingPage.module.css';

export const LandingPage = () => (
  <main className={styles.landingPage}>
    <h1 className={styles.landingPage__header}>track what you pack, app</h1>
    <section className={styles.landingPage__banner}>
      <figure>
        <img src="https://images.unsplash.com/photo-1603861609805-29b5fda4a585?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2140&q=80" alt="Labelled boxes" />
      </figure>
      <Instructions />
    </section>
    <Link to="/register">
      <button type="button" className={styles.landingPage__btn__register}>Register</button>
    </Link>
    <Link to="/login">
      <button type="button" className={styles.landingPage__btn__login}>Login</button>
    </Link>
  </main>
);
