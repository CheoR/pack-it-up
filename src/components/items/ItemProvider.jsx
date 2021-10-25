import React, { createContext, useContext, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import { authApi } from '../auth/authSettings';

const { localApiBaseUrl: baseURL } = authApi;

export const ItemContext = createContext();

export const ItemProvider = (props) => {
  const { user } = useContext(UserContext);

  const [items, setItems] = useState([]);

  const getItems = () => fetch(`${baseURL}/items?_expand=box`)
    .then((res) => res.json())
    .then(setItems); // getItems

  const getItemByItemId = (id) => fetch(`${baseURL}/items/${id}?_expand=box`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(`Error: ${err}`);
    }); // getItems

  const getItemsByUserId = () => fetch(`${baseURL}/items?userId=${user.id}&_expand=box`)
    .then((res) => res.json())
    .then(setItems)
    .catch((err) => {
      console.log(`Error: ${err}`);
    }); // getItems

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
      getItemByItemId,
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
