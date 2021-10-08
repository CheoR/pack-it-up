import React, { createContext, useState } from 'react';

const baseURL = 'http://localhost:8088';

export const ItemContext = createContext();

export const ItemProvider = (props) => {
  const [items, setItems] = useState([]);

  const getItems = () => fetch(`${baseURL}/items?_expand=box`)
    .then((res) => res.json())
    .then(setItems);

  const addItem = (item) => fetch(`${baseURL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })
    .then(getItems);

  const updateItem = (item) => fetch(`${baseURL}/items/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })
    .then(getItems);

  const deleteItem = (id) => fetch(`${baseURL}/items/${id}`, {
    method: 'DELETE',
  })
    .then(getItems);

  return (
    <ItemContext.Provider value={{
      items,
      getItems,
      setItems,
      addItem,
      updateItem,
      deleteItem,
    }}>
      {props.children}
    </ItemContext.Provider>
  );
};
