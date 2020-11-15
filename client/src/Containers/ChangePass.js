import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup, FormControl, Alert } from "react-bootstrap";
import "./../Style/Login.css";
import { useAppContext } from "../libs/contextLib";
import { useHistory, Redirect, useLocation } from "react-router-dom";

export default function ChangePass() {
  const [ password, setPassword ] = useState("");
  const [ cnfPassword, setCnfPassword ] = useState("");
  const [ message, setMessage ] = useState("");
  const [ variant, setVariant ] = useState("");
  const [ userId, setUserId ] = useState(null);
  const { isAuthenticated } = useAppContext();
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    setUserId(query.get("id"));
    const response = await fetch('/api/user/checkToken?'+ new URLSearchParams({
      'userId': query.get("id")
    }));
    const tokenValidation = await response.json();
    if (!tokenValidation.tokenExist) {
      alert('No reset token exist for the user please follow the forgot password flow again');
      history.push("/Login");
    } else if (tokenValidation.isExpired) {
      alert('The reset token has expired for the user please follow the forgot password flow again');
      history.push("/Login");
    }
  }

  function validateForm() {
    if (password === cnfPassword) {
      return true;
    }
    return false;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch('/api/user/changePass?' + new URLSearchParams({
      'password': password,
      'userId': userId
    }));
    history.push("/Login");

  }

  return (
    !isAuthenticated?
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <FormControl
            autoFocus
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="cnfPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <FormControl
            value={cnfPassword}
            onChange={e => setCnfPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        { message.length > 0 &&
          <Alert variant={variant} onClose={() => setMessage('') } dismissible>
            <Alert.Heading>{message}</Alert.Heading>
          </Alert>
        }
        <Button block size="lg" disabled={!validateForm()} type="submit">
          Reset
        </Button>
      </form>
    </div>:
    <Redirect to="/Login" />
  );
}