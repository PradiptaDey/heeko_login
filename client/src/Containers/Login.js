import React, { useState } from "react";
import { Form, Button, FormGroup, FormControl } from "react-bootstrap";
import "./../Style/Login.css";
import { useAppContext } from "../libs/contextLib";
import { useHistory, Redirect } from "react-router-dom";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  const history = useHistory();

  function validateForm() {
    return userName.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username: userName, Password: password }),
    });
    try {
      const body = await response.json();
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      alert('Wrong Username and Password');
    }
  }

  return (
    !isAuthenticated?
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="userName" size="lg">
          <Form.Label>Username</Form.Label>
          <FormControl
            autoFocus
            type="userName"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button variant="link" onClick={() => history.push("/ForgotPW")}>Forgot Password?</Button>
        <Button block size="lg" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>:
    <Redirect to="/" />
  );
}