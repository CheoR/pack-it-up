import React, { createContext, useState } from 'react';
import { userStorageKey } from '../auth/authSettings';

const baseURL = 'http://localhost:8088';

export const ItemContext = createContext();

export const ItemProvider = (props) => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const [items, setItems] = useState([]);

  const getItems = () => fetch(`${baseURL}/items?_expand=box`)
    .then((res) => res.json())
    .then(setItems); // getItems

  const getItemsByUserId = () => fetch(`${baseURL}/items?userId=${loggedInUserId}`)
    .then((res) => res.json())
    .then(setItems); // getItems

  const addItem = (item) => fetch(`${baseURL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })
    .then(getItemsByUserId); // addItem

  const updateItem = (item) => fetch(`${baseURL}/items/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })
    .then(getItemsByUserId); // updateItem

  const deleteItem = (id) => fetch(`${baseURL}/items/${id}`, {
    method: 'DELETE',
  })
    .then(getItemsByUserId); // deleteItem

  const uploadItemImage = (formData) => fetch('https://api.Cloudinary.com/v1_1/cheor/image/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => res); // postImage

  return (
    <ItemContext.Provider value={{
      items,
      getItems,
      getItemsByUserId,
      setItems,
      addItem,
      updateItem,
      deleteItem,
      uploadItemImage,
    }}>
      { props.children }
    </ItemContext.Provider>
  );
};
