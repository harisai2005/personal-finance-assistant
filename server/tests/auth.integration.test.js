// tests/auth.integration.test.js
const request = require('supertest');
const createTestServer = require('./testServer');
require('./setup');
process.env.JWT_SECRET = 'hari_secret_2025';

let server;
let app;

beforeAll(async () => {
  app = createTestServer();
  await new Promise(resolve => {
    server = app.listen(0, resolve);
  });
  global.agent = request.agent(server);
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe('🔐 Auth API Integration', () => {
  it('should register and return a token', async () => {
    const res = await global.agent.post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should not allow duplicate registration', async () => {
    await global.agent.post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await global.agent.post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
  });

  it('should login and return token', async () => {
    await global.agent.post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'loginpass',
    });

    const res = await global.agent.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'loginpass',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    await global.agent.post('/api/auth/register').send({
      name: 'Wrong Password',
      email: 'wrong@example.com',
      password: 'correct',
    });

    const res = await global.agent.post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'incorrect',
    });

    expect(res.statusCode).toBe(401);
  });
});
