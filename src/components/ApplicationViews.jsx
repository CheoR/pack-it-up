import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserPage } from './routes/userPages/UserPage';
import { ItemProvider } from './items/ItemProvider';
import { ItemList } from './items/ItemList';
import { ItemDetail } from './items/ItemDetail';
import { BoxProvider } from './boxes/BoxProvider';
import { BoxList } from './boxes/BoxList';
import { BoxDetail } from './boxes/BoxDetail';
import { MoveProvider } from './moves/MoveProvider';
import { MoveList } from './moves/MoveList';
import { MoveDetail } from './moves/MoveDetail';
import { UserProvider } from './users/UserProvider';

// import { Home } from "./Home"

export const ApplicationViews = () => (
  <>
    <UserProvider><MoveProvider><BoxProvider><ItemProvider>
      <Switch>
        <Route exact path="/users">
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
); // ApplicationViews
