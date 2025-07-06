// src/services/uploadService.js
import API from './api';

// Upload a receipt file (image or PDF) with selected mode (POS or transaction-history)
export const uploadReceipt = async (file, mode = 'pos') => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);  // 📎 Actual file
    formData.append('mode', mode);     // 📌 Receipt type selector

    const response = await API.post('/upload/receipt', formData);
    return response;
  } catch (err) {
    console.error("❌ Receipt upload failed:", err.response?.data || err.message);
    throw err;
  }
};
