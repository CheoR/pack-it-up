import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './summary.module.css';

const SummaryRow = ({ typeObj }) => (
  <li className={styles.summary__li}>
    <h2 className={styles.summary__dataType}>{ typeObj.data.type }</h2>
    <div className={styles.summary__dataLength}>{ typeObj.data.count }</div>
    <NavLink to={`/${typeObj.data.type}`} className={styles.summary__navlink__view}>
      {/*
        disabled=! because if option can be used, boolean true will disable the option so
        flag must be flipped.
      */}
      <button type="button" className={styles.summary__navlinkBtn__view} disabled={!typeObj.data.canUse}>
        Add/View
      </button>
    </NavLink>
  </li>
);

export const Summary = ({ listOfTypes }) => (
  <ul className={styles.summary__ul}>
    {
      listOfTypes.map((data) => <SummaryRow key={`${data.type}`} typeObj={{ data }} />)
    }
  </ul>
);
