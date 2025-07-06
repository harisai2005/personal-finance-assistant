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

  const navLink = (to, label) => (
    <Nav.Link
      as={Link}
      to={to}
      active={location.pathname === to}
      className={location.pathname === to ? 'active-link' : ''}
    >
      {label}
    </Nav.Link>
  );

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3 custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          💼 Personal Finance Assistant
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                {navLink('/', 'Dashboard')}
                {navLink('/add', 'Add')}
                {navLink('/transactions', 'Transactions')}
                {navLink('/analytics', 'Analytics')}
                <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {navLink('/auth', 'Login')}
                {navLink('/auth', 'Register')}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
