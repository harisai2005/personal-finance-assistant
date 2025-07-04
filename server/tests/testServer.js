// tests/testServer.js
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const transactionRoutes = require('../routes/transactionRoutes');

module.exports = function createTestServer() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);
  return app;
};
