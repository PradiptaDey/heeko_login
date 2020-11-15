import React, { useState } from "react";
import { Form, Button, FormGroup, FormControl, Alert } from "react-bootstrap";
import "./../Style/Login.css";
import { useAppContext } from "../libs/contextLib";
import { Redirect } from "react-router-dom";

export default function ForgotPW() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");
  const { isAuthenticated } = useAppContext();

  function validateForm() {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return true;
    }
    return false;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/user/forgotpw?' + new URLSearchParams({
      'email': email
    }));
    const userData = await response.json();
    if (userData.length > 0) {
      setVariant('success');
      setMessage('Email with a link to reset the password has been sent');
    } else {
      setVariant('danger');
      setMessage('Email does not exist in the hub please register yourself');
    }
  }

  return (
    !isAuthenticated?
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="Email" size="lg">
          <Form.Label>Email</Form.Label>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        { message.length > 0 &&
          <Alert variant={variant} onClose={() => setMessage('') } dismissible>
            <Alert.Heading>{message}</Alert.Heading>
          </Alert>
        }
        <Button block size="lg" disabled={!validateForm()} type="submit">
          Send Reset Link
        </Button>
      </form>
    </div>:
    <Redirect to="/" />
  );
}