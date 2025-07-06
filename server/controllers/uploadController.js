const extractFromReceipt = require('../utils/extractFromReceipt');

/**
 * Handles file upload and sends it for data extraction.
 * Accepts a mode: 'pos' or 'history'
 */
const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const mode = req.body.mode || 'pos';

    const extractedTransactions = await extractFromReceipt(req.file.path, userId, mode);

    res.status(200).json({
      message: 'Receipt processed successfully',
      extractedData: extractedTransactions.length === 1 ? extractedTransactions[0] : null,
      insertedCount: extractedTransactions.length,
    });
  } catch (error) {
    console.error('❌ Receipt upload error:', error.message);
    res.status(500).json({ message: 'Failed to process receipt' });
  }
};

module.exports = { uploadReceipt };
