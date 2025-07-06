const request = require('supertest');
const createTestServer = require('./testServer');
require('./setup');
process.env.JWT_SECRET = 'hari_secret_2025';

let server;
let app;

// Setup server before tests
beforeAll(async () => {
  app = createTestServer();
  await new Promise(resolve => {
    server = app.listen(0, resolve);
  });
});

// Cleanup after tests
afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

/**
 * Registers and returns an authenticated agent + token
 */
async function getAuthTokenAndAgent() {
  const agent = request.agent(server);
  const res = await agent.post('/api/auth/register').send({
    name: 'Trans User',
    email: `trans${Date.now()}@example.com`,
    password: 'transpass',
  });

  if (res.statusCode !== 201 || !res.body.token) {
    throw new Error('❌ Registration failed. Cannot get token for testing.');
  }

  return { agent, token: res.body.token };
}

describe('💰 Transactions API Integration', () => {
  it('✅ should add a valid transaction', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    const res = await agent
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 300,
        description: 'Lunch',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(300);
  });

  it('📋 should fetch all transactions', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    await agent.post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense', category: 'Groceries', amount: 150 });

    const res = await agent
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('📊 should fetch category summary', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    await agent.post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense', category: 'Groceries', amount: 150 });

    const res = await agent
      .get('/api/transactions/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.categoryBreakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: 'Groceries', total: expect.any(Number) })
      ])
    );
  });

  it('🚫 should reject requests without token', async () => {
    const agent = request.agent(server);
    const res = await agent.get('/api/transactions');
    expect(res.statusCode).toBe(401);
  });

  it('❌ should fail with invalid transaction input', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    const res = await agent
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense' }); // missing category & amount

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('✏️ should update an existing transaction', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    const addRes = await agent
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'income', category: 'Salary', amount: 1000 });

    const id = addRes.body._id;

    const updateRes = await agent
      .put(`/api/transactions/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1200 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.amount).toBe(1200);
  });

  it('🗑️ should delete a transaction', async () => {
    const { agent, token } = await getAuthTokenAndAgent();

    const addRes = await agent
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'expense', category: 'Bills', amount: 200 });

    const id = addRes.body._id;

    const delRes = await agent
      .delete(`/api/transactions/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.message).toMatch(/deleted/i);
  });
});
