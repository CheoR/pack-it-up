import React, { createContext, useState } from 'react';

const baseURL = 'http://localhost:8088';

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
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
