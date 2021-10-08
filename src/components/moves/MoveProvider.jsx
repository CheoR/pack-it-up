import React, { createContext, useState } from 'react';

const baseURL = 'http://localhost:8088';

export const MoveContext = createContext();

export const MoveProvider = (props) => {
  const [moves, setMoves] = useState([]);

  const getMoves = () => fetch(`${baseURL}/moves?_expand=user`)
    .then((res) => res.json())
    .then(setMoves);

  const addMove = (move) => fetch(`${baseURL}/moves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(move),
  })
    .then(getMoves);

  const updateMove = (move) => fetch(`${baseURL}/moves/${move.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(move),
  })
    .then(getMoves);

  const deleteMove = (id) => fetch(`${baseURL}/moves/${id}`, {
    method: 'DELETE',
  })
    .then(getMoves);

  return (
    <MoveContext.Provider value={{
      moves,
      getMoves,
      setMoves,
      addMove,
      updateMove,
      deleteMove,
    }}>
      {props.children}
    </MoveContext.Provider>
  );
};
