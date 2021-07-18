import React from 'react';
import { SummaryList } from '../../summary/SummaryList';
import styles from './userPage.module.css';

export const UserPage = () => (
  <main className={styles.userPage}>
    <SummaryList />
  </main>
);
