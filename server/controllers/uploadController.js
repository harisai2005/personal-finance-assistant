const fs = require('fs');
const path = require('path');
console.log('✅ uploadController loaded');
const extractFromReceipt = require('../utils/extractFromReceipt');

const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const extractedData = await extractFromReceipt(req.file.path, userId);

    res.status(200).json({ extractedData });
  } catch (error) {
    console.error('❌ Receipt upload error:', error.message);
    res.status(500).json({ message: 'Failed to process receipt' });
  }
};

module.exports = { uploadReceipt };
