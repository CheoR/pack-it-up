import React from "react";
import { Route, Redirect } from "react-router-dom"
import { userStorageKey } from "./auth/authSettings"
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";

import { ApplicationViews } from "./ApplicationViews";
import { LandingPage } from "./routes/landingPage/LandingPage"
import { UserPage } from "./routes/users/UserPage";

export const PackItUp = () => (
  <>

  <Route render={() => {
  if (sessionStorage.getItem(userStorageKey)) {
   return (
    <>
    { /* Components that are rendered when the user is authenticated go inside this React fragment */}
    <UserPage />
    </>
   )
  } else {
    // return <Redirect to="/login" />;

    return <Redirect to="/" />;
  }
}} /> {/* Route */}

  <Route exact path="/">
    <LandingPage />

  </Route>

  <Route path="/login">
   <Login />
  </Route>

  <Route path="/register">
   <Register />
  </Route>
  </>
);