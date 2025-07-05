import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅
import '../styles/Navbar.css';

const CustomNavbar = () => {
  const { isLoggedIn, logout } = useAuth(); // ✅
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ clears localStorage + context
    navigate('/auth');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3">
      <Container>
        <Navbar.Brand as={Link} to="/">💼 Personal Finance Assistant</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn ? (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/add">Add</Nav.Link>
              <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
              <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
              <Button variant="outline-danger" className="ms-2" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/auth">Login</Nav.Link>
              <Nav.Link as={Link} to="/auth">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
