import React from 'react';

import logo from '../../assets/images/PackItUpLogo.png';

import styles from './userHeader.module.css';

export const UserHeader = ({ user, text }) => (
  <section className={styles.header}>
    <img src={logo} className={styles.logo} alt="Pack It Up Logo" />
    <h1 className={styles.username}>{`${user.username}'s ${text}`}</h1>
  </section>
);
