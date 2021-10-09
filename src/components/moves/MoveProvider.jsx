import React, { createContext, useState } from 'react';

import { userStorageKey, authApi } from '../auth/authSettings';

const { baseURL } = authApi;

export const MoveContext = createContext();

export const MoveProvider = (props) => {
  const loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey), 10);
  const [moves, setMoves] = useState([]);

  const getMoves = () => fetch(`${baseURL}/moves?_expand=user`)
    .then((res) => res.json())
    .then(setMoves); // getMoves

  const getMovesByUserId = () => fetch(`${baseURL}/moves?userId=${loggedInUserId}`)
    .then((res) => res.json())
    .then(setMoves); // getMoves

  const addMove = (move) => fetch(`${baseURL}/moves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(move),
  })
    .then(getMovesByUserId);

  const updateMove = (move) => fetch(`${baseURL}/moves/${move.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(move),
  })
    .then(getMovesByUserId); // sendMessage

  const deleteMove = (id) => fetch(`${baseURL}/moves/${id}`, {
    method: 'DELETE',
  })
    .then(getMovesByUserId); // deleteItem

  return (
    <MoveContext.Provider value={{
      moves,
      getMoves,
      getMovesByUserId,
      setMoves,
      addMove,
      updateMove,
      deleteMove,
    }}>
      { props.children }
    </MoveContext.Provider>
  );
};
