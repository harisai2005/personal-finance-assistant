import API from './api';

export const uploadReceipt = (file) => {
  const formData = new FormData();
  formData.append('receipt', file);
  return API.post('/upload/receipt', formData);
};
