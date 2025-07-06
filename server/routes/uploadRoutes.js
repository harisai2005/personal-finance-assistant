const express = require('express');
const { uploadReceipt } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// Configure multer for file upload
const upload = multer({ storage });

/**
 * @route   POST /api/upload/receipt
 * @desc    Upload a receipt (image/pdf) for expense extraction
 */
router.post('/receipt', protect, upload.single('receipt'), uploadReceipt);

module.exports = router;
