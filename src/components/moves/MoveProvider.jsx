import React, { createContext, useContext, useState } from 'react';

import { UserContext } from '../auth/UserProvider';
import { authApi } from '../auth/authSettings';

const { localApiBaseUrl: baseURL } = authApi;

export const MoveContext = createContext();

export const MoveProvider = (props) => {
  const { user } = useContext(UserContext);

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

  const getMovesByUserId = () => fetch(`${baseURL}/moves?userId=${user.id}`)
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
