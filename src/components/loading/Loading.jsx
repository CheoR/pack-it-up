import React from 'react';

import logo from '../../assets/images/PackItUpLogo.png';

import styles from './loading.module.css';

export const Loading = () => (
  <div className={styles.loading}>
    <img src={logo} className={styles.logo} alt="Pack It Up Logo" />
    <h1>Loading</h1>
  </div>
);
