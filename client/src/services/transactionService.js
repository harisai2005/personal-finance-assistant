import API from './api';

// Add a new transaction
export const addTransaction = (data) => API.post('/transactions', data);

// Get transactions with optional pagination
export const getTransactions = (start, end, page = 1, limit = 10) => {
  return API.get(`/transactions?start=${start}&end=${end}&page=${page}&limit=${limit}`);
};

// Get category-wise summary
export const getSummary = async () => {
  try {
    return await API.get('/transactions/summary');
  } catch (err) {
    console.error("❌ getSummary error:", err.response?.data || err.message);
    throw err;
  }
};

// Update a transaction by ID
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);

// Delete a transaction by ID
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Get daily expenses (last 7 days)
export const getDailyExpenses = () => API.get('/transactions/daily');

// Get analytics (optional)
export const getAnalytics = () => API.get('/transactions/analytics');
