import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { Navbar } from './navbar/Navbar';

import { UserProvider } from './auth/UserProvider';
import { UserPage } from './pages/UserPage';

import { MoveProvider } from './moves/MoveProvider';
import { MoveList } from './moves/MoveList';
import { MoveDetail } from './moves/MoveDetail';

import { BoxProvider } from './boxes/BoxProvider';
import { BoxList } from './boxes/BoxList';
import { BoxDetail } from './boxes/BoxDetail';

import { ItemProvider } from './items/ItemProvider';
import { ItemList } from './items/ItemList';
import { ItemDetail } from './items/ItemDetail';
import { authApi } from './auth/authSettings';

export const PackItUp = () => {
  const { userStorageKey } = authApi;
  const userId = parseInt(sessionStorage.getItem(userStorageKey) || 0, 10);

  return (
    <>
      <UserProvider><MoveProvider><BoxProvider><ItemProvider>
        <Navbar />
        <Switch>
          <Route exact path="/">
            {
              userId
                ? <UserPage />
                : <LandingPage />
            }
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route exact path="/user">
            <UserPage />
          </Route>

          <Route exact path="/items">
            <ItemList />
          </Route>

          <Route exact path="/items/:itemId(\d+)">
            <ItemDetail />
          </Route>

          <Route exact path="/boxes">
            <BoxList />
          </Route>

          <Route exact path="/boxes/:boxId(\d+)">
            <BoxDetail />
          </Route>

          <Route exact path="/moves">
            <MoveList />
          </Route>

          <Route exact path="/moves/:moveId(\d+)">
            <MoveDetail />
          </Route>
        </Switch>
        {/* eslint-disable-next-line react/jsx-closing-tag-location */}
      </ItemProvider></BoxProvider></MoveProvider></UserProvider>
    </>
  );
};
