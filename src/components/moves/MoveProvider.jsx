import React, { createContext, useState } from 'react';

import { authApi } from '../auth/authSettings';

const { localApiBaseUrl: baseURL } = authApi;

export const MoveContext = createContext();

export const MoveProvider = (props) => {
  const [moves, setMoves] = useState([]);

  const getMoves = () => fetch(`${baseURL}/moves?_expand=user`)
    .then((res) => res.json())
    .then(setMoves); // getMoves

  const getMoveByMoveId = (id) => fetch(`${baseURL}/moves/${id}`)
    .then((res) => res.json())
    .then(setMoves)
    .catch((err) => {
      console.log(`Error: ${err}`);
    }); // getMoves

  const getMovesByUserId = (id) => fetch(`${baseURL}/moves?userId=${id}`)
    .then((res) => res.json())
    .then(setMoves)
    .catch((err) => {
      console.log(`Error: ${err}`);
    }); // getMoves

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
      getMoveByMoveId,
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
