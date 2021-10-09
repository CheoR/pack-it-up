import React, { createContext, useState } from 'react';
import { authApi } from '../auth/authSettings';

const { baseURL } = authApi;

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [users, setUsers] = useState([]);

  const getUsers = () => fetch(`${baseURL}/users`)
    .then((res) => res.json())
    .then(setUsers);

  return (
    <UserContext.Provider value={{
      users,
      getUsers,
      setUsers,
    }}
    >
      { props.children }
    </UserContext.Provider>
  );
};
