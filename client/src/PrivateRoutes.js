import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./Containers/Home";
import { useAppContext } from "./libs/contextLib";

function PrivateRoutes() {
  const { isAuthenticated } = useAppContext();
  console.log(window.location.pathname);
  return (
    isAuthenticated ?
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
    </Switch>:
    window.location.pathname ?
    <Redirect to={`${window.location.pathname}`} /> :
    <Redirect to="/Login" />
  );
}

export default PrivateRoutes;