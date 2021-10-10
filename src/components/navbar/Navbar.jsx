import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { userStorageKey, userStorageUserName } from '../auth/authSettings';
import { UserContext } from '../users/UserProvider';
import './navbar.css';

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { users, getUser } = useContext(UserContext);
  // const history = useHistory();

  useEffect(() => {
    getUser()
      .then(() => {
        const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);

        if (loggedInUserId) {
          const loggedInUser = users.find((user) => user.id === loggedInUserId);

          /*
          Not sure why ? is needed.
          First render causes error, but if loggedInUserId is true, shouldn't
          users already be fufilled?
          */
          sessionStorage.setItem(userStorageUserName, loggedInUser?.username);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }); // then
  }, [isLoggedIn]); // useEffect

  // const handleLogout = (event) => {
  //   event.preventDefault();

  //   sessionStorage.removeItem('app_user_id');
  //   sessionStorage.removeItem('app_user_username');
  //   setIsLoggedIn(false);
  //   history.push('/');
  // };

  return (
    <nav className="navbar">
      <ul className="navbar__ul">
        <li className="navbar__li">
          <Link className="navbar__link" to="/users">Home</Link>
        </li>
        <li className="navbar__li">
          <Link className="navbar__link" to="/moves">Moves</Link>
        </li>
        <li className="navbar__li">
          <Link className="navbar__link" to="/boxes">Boxes</Link>
        </li>
        <li className="navbar__li">
          <Link className="navbar__link" to="/items">Items</Link>
        </li>
        <li className="navbar__li">
          <Link className="navbar__link" to="/Settings">Settings</Link>
        </li>
        {/* <li className="navbar__li">
          <button type="button" className="navbar__link" onClick={handleLogout}>Logout</button>
        </li> */}
      </ul>
    </nav>
  );
};
