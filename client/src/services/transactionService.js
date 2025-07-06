// src/services/transactionService.js
import API from './api';

// Add a new income/expense transaction
export const addTransaction = async (data) => {
  try {
    return await API.post('/transactions', data);
  } catch (err) {
    console.error("❌ Failed to add transaction:", err.response?.data || err.message);
    throw err;
  }
};

// Get paginated transactions between a date range
export const getTransactions = async (start, end, page = 1, limit = 10) => {
  try {
    const response = await API.get(`/transactions`, {
      params: { start, end, page, limit },
    });
    return response;
  } catch (err) {
    console.error("❌ Failed to fetch transactions:", err.response?.data || err.message);
    throw err;
  }
};

// Get category-wise expense/income summary
export const getSummary = async () => {
  try {
    return await API.get('/transactions/summary');
  } catch (err) {
    console.error("❌ Failed to fetch summary:", err.response?.data || err.message);
    throw err;
  }
};

// Update an existing transaction by ID
export const updateTransaction = async (id, data) => {
  try {
    return await API.put(`/transactions/${id}`, data);
  } catch (err) {
    console.error("❌ Failed to update transaction:", err.response?.data || err.message);
    throw err;
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (id) => {
  try {
    return await API.delete(`/transactions/${id}`);
  } catch (err) {
    console.error("❌ Failed to delete transaction:", err.response?.data || err.message);
    throw err;
  }
};

// Get past 7-day daily expense summary
export const getDailyExpenses = async () => {
  try {
    return await API.get('/transactions/daily');
  } catch (err) {
    console.error("❌ Failed to fetch daily expenses:", err.response?.data || err.message);
    throw err;
  }
};

// Reserved for future analytics API
export const getAnalytics = async () => {
  try {
    return await API.get('/transactions/analytics');
  } catch (err) {
    console.error("❌ Failed to fetch analytics:", err.response?.data || err.message);
    throw err;
  }
};
