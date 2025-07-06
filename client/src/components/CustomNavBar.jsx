import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const CustomNavbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3 custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">💼 Personal Finance Assistant</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {isLoggedIn ? (
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                active={location.pathname === '/'}
                className={location.pathname === '/' ? 'active-link' : ''}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/add"
                active={location.pathname === '/add'}
                className={location.pathname === '/add' ? 'active-link' : ''}
              >
                Add
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/transactions"
                active={location.pathname === '/transactions'}
                className={location.pathname === '/transactions' ? 'active-link' : ''}
              >
                Transactions
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/analytics"
                active={location.pathname === '/analytics'}
                className={location.pathname === '/analytics' ? 'active-link' : ''}
              >
                Analytics
              </Nav.Link>
              <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/auth" className={location.pathname === '/auth' ? 'active-link' : ''}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/auth" className={location.pathname === '/auth' ? 'active-link' : ''}>
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
