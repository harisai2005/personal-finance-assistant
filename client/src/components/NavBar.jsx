import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const CustomNavbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <Navbar bg="transparent" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-title">
          Personal Finance Assistant
        </Navbar.Brand>
        {isAuthPage && (
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/auth" className="nav-link-text">
              Login / Signup
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
