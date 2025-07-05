import React, { useState } from 'react';
import { login as apiLogin, register } from '../services/authService'; // ✅ renamed to avoid clash
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavBar';
import '../styles/AuthPage.css';
import { useAuth } from '../context/AuthContext'; // ✅ import context

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // ✅ get context login method

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin ? await apiLogin(form) : await register(form); // ✅ use renamed api login
      const token = res.data.token;
      authLogin(token); // ✅ set token in context + storage
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <>
      <CustomNavbar />
      <div className="auth-container">
        <Card className="auth-card shadow">
          <h2 className="auth-title mb-4">
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </h2>
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
