const fs = require('fs');
const path = require('path');
const extractFromReceipt = require('../utils/extractFromReceipt');

exports.uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const extractedData = await extractFromReceipt(req.file.path);
  res.json({ extractedData });
};
