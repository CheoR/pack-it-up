import React, { createContext, useState } from 'react';
import { userStorageKey, userStorageUserName } from './authSettings';

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState({});

  const login = (userObj) => {
    sessionStorage.setItem(userStorageUserName, userObj.username);
    sessionStorage.setItem(userStorageKey, userObj.id);
    setUser(userObj);
  };

  const logout = () => {
    setUser({});
    sessionStorage.removeItem(userStorageUserName);
    sessionStorage.removeItem(userStorageKey);
  };

  const isUserLoggedIn = () => !!user.id;

  return (
    <UserContext.Provider value={{
      user,
      isUserLoggedIn,
      login,
      logout,
    }}
    >
      { props.children }
    </UserContext.Provider>
  );
};
