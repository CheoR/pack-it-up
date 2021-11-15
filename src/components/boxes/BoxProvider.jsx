import React, { createContext, useContext, useState } from 'react';

import { authApi } from '../auth/authSettings';

import { UserContext } from '../auth/UserProvider';

const { localApiBaseUrl: baseURL } = authApi;

export const BoxContext = createContext();

export const BoxProvider = (props) => {
  const { user } = useContext(UserContext);
  const [boxes, setBoxes] = useState([]);

  const getBoxes = () => fetch(`${baseURL}/boxes?_expand=move`)
    .then((res) => res.json())
    .then(setBoxes); // getBoxes

  const getBoxByBoxId = (id) => fetch(`${baseURL}/boxes/${id}?_embed=items&_expand=move`)
    .then((res) => res.json())
    .catch((err) => {
      console.error(`Error: ${err}`);
    }); // getBoxes

  const getBoxesByUserId = () => fetch(`${baseURL}/boxes?userId=${user.id}&_embed=items&_expand=move`)
    .then((res) => res.json())
    .then(setBoxes)
    .catch((err) => {
      console.error(`Error: ${err}`);
    }); // getBoxes

  const addBox = (box) => fetch(`${baseURL}/boxes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(box),
  })
    .then(getBoxesByUserId); // addItem

  const updateBox = (box) => fetch(`${baseURL}/boxes/${box.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(box),
  })
    .then(getBoxesByUserId); // updateBox

  const deleteBox = async (id) => fetch(`${baseURL}/boxes/${id}`, {
    method: 'DELETE',
  })
    .then(getBoxesByUserId(user.id)); // deleteBox

  return (
    <BoxContext.Provider value={{
      boxes,
      addBox,
      updateBox,
      getBoxes,
      getBoxByBoxId,
      getBoxesByUserId,
      setBoxes,
      deleteBox,
    }}>
      { props.children }
    </BoxContext.Provider>
  );
};
