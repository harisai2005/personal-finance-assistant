import API from './api';

// Add a new transaction
export const addTransaction = (data) => {
  return API.post('/transactions', data);
};

// Get transactions with optional date filtering
export const getTransactions = (start, end) => {
  return API.get(`/transactions?start=${start}&end=${end}`);
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
export const updateTransaction = (id, data) => {
  return API.put(`/transactions/${id}`, data);
};

// Delete a transaction by ID
export const deleteTransaction = (id) => {
  return API.delete(`/transactions/${id}`);
};

// ✅ Get daily expenses (last 7 days)
export const getDailyExpenses = () => {
  return API.get('/transactions/daily');
};

// ✅ Get full analytics (if supported by backend)
export const getAnalytics = () => {
  return API.get('/transactions/analytics');
};
