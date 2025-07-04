import API from './api';

export const addTransaction = (data) => API.post('/transactions', data);
export const getTransactions = (start, end) =>
  API.get(`/transactions?start=${start}&end=${end}`);
export const getSummary = () => API.get('/transactions/summary');
