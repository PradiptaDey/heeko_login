import React from "react";
import { Route, Switch } from "react-router-dom";
import ForgotPW from "./Containers/ForgotPW";
import ChangePass from "./Containers/ChangePass";
import Login from "./Containers/Login";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/Login">
        <Login />
      </Route>
      <Route exact path="/ForgotPw">
        <ForgotPW />
      </Route>
      <Route exact path="/ChangePass">
        <ChangePass />
      </Route>
    </Switch>
  );
}
