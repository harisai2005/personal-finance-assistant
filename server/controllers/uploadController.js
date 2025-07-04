const fs = require('fs');
const path = require('path');
console.log('✅ uploadController loaded');
const extractFromReceipt = require('../utils/extractFromReceipt');

// Upload receipt and return extracted dummy data
const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // This function returns static transaction data
    const extractedData = await extractFromReceipt(req.file.path);

    res.status(200).json({ extractedData });
  } catch (error) {
    console.error('❌ Receipt upload error:', error.message);
    res.status(500).json({ message: 'Failed to process receipt' });
  }
};

module.exports = { uploadReceipt };


