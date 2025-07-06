const express = require('express');
const multer = require('multer');
const { uploadReceipt } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/**
 * @route   POST /api/upload/receipt
 * @desc    Upload a receipt (image/pdf) for expense extraction
 */
router.post('/receipt', protect, upload.single('receipt'), uploadReceipt);

module.exports = router;
