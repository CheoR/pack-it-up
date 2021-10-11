import React, { createContext, useState } from 'react';

import { authApi } from '../auth/authSettings';

const { localApiBaseUrl: baseURL } = authApi;

export const BoxContext = createContext();

export const BoxProvider = (props) => {
  const [boxes, setBoxes] = useState([]);

  const getBoxes = () => fetch(`${baseURL}/boxes?_expand=move`)
    .then((res) => res.json())
    .then(setBoxes); // getBoxes

  const getBoxesByUserId = (id) => fetch(`${baseURL}/boxes?userId=${id}`)
    .then((res) => res.json())
    .then(setBoxes)
    .catch((err) => {
      console.log(`Error: ${err}`);
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

  const deleteBox = (id) => fetch(`${baseURL}/boxes/${id}`, {
    method: 'DELETE',
  })
    .then(getBoxesByUserId); // deleteBox

  return (
    <BoxContext.Provider value={{
      boxes,
      addBox,
      updateBox,
      getBoxes,
      getBoxesByUserId,
      setBoxes,
      deleteBox,
    }}>
      { props.children }
    </BoxContext.Provider>
  );
};
