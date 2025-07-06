// src/services/uploadService.js
import API from './api';

export const uploadReceipt = (file, mode = 'pos') => {
  const formData = new FormData();
  formData.append('receipt', file);
  formData.append('mode', mode);
  return API.post('/upload/receipt', formData);
};
