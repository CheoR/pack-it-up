import { Link, useHistory } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import styles from './navbar.module.css';

export const Navbar = () => {
  const { logout, isUserLoggedIn } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (isUserLoggedIn()) {
      setIsLoggedIn(true);
    }
  }, [isUserLoggedIn()]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    history.push('/');
  };

  const handleLogin = () => {
    history.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar__ul}>
        {
          isLoggedIn
            ? (
              <>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/user">Home</Link>
                </li>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/moves">Moves</Link>
                </li>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/boxes">Boxes</Link>
                </li>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/items">Items</Link>
                </li>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/settings">Settings</Link>
                </li>
                <li className={styles.navbar__li}>
                  <button type="button" className={styles.navbar__link} onClick={handleLogout}>Logout</button>
                </li>
              </>
            )
            : (
              <>
                <li className={styles.navbar__li}>
                  <Link className={styles.navbar__link} to="/">Home</Link>
                </li>
                <li className={styles.navbar__li}>
                  <button type="button" className={styles.navbar__link} onClick={handleLogin}>Login</button>
                </li>
              </>
            )
        }
      </ul>
    </nav>
  );
};
