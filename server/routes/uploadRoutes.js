const express = require('express');
const multer = require('multer');
const { uploadReceipt } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/receipt', protect, upload.single('receipt'), uploadReceipt);

module.exports = router;
