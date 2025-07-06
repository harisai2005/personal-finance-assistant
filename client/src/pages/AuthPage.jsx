import React, { useState } from 'react';
import { login as apiLogin, register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavBar';
import '../styles/AuthPage.css';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validate = () => {
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Please enter a valid email address.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (!isLogin && form.name.trim() === '') {
      return 'Name is required for registration.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError('');

    try {
      const res = isLogin ? await apiLogin(form) : await register(form);
      const token = res.data.token;
      authLogin(token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  return (
    <>
      <CustomNavbar />
      <div className="auth-container">
        <Card className="auth-card shadow">
          <h2 className="auth-title mb-4">
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="auth-submit w-100">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </Form>
          <div className="auth-switch text-center mt-3">
            <span>
              {isLogin ? "Don't have an account?" : 'Already a user?'}{' '}
              <Button variant="link" className="p-0 auth-link" onClick={toggleMode}>
                {isLogin ? 'Register' : 'Login'}
              </Button>
            </span>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;
