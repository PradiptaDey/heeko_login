import React, { useState, useEffect } from "react";
import { Nav, Navbar, Tab, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from "./Routes";
import PrivateRoutes from "./PrivateRoutes";
import { AppContext } from "./libs/contextLib";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    const response = await fetch('/api/user/loggedInUser');
    const body = await response.json();

    if (body.userName) {
      userHasAuthenticated(true);
    } else {
      console.log("User is not logged in");
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await fetch('/logout');
    userHasAuthenticated(false);
  }

  return (
    <div>
      <Navbar collapseOnSelect bg="light" expand="lg">
        <Navbar.Brand>
          {
            isAuthenticated &&
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
          }
        </Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse className="justify-content-end" >
          <Nav>
            {isAuthenticated
              ? <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              :
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Tab.Container id="left-tabs-example">
        <Row>
          <Col sm={12}>
            <Tab.Content>
              <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
                <PrivateRoutes />
              </AppContext.Provider>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default App;
