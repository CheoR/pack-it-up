import React, { createContext, useState } from 'react';
import { authApi } from '../auth/authSettings';

const { baseURL } = authApi;

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState([]);

  const getUser = () => fetch(`${baseURL}/users`)
    .then((res) => res.json())
    .then(setUser);

  return (
    <UserContext.Provider value={{
      user,
      getUser,
      setUser,
    }}
    >
      { props.children }
    </UserContext.Provider>
  );
};
