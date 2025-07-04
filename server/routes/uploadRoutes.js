const express = require('express');
const multer = require('multer');
const { uploadReceipt } = require('../controllers/uploadController'); // ✅ import

const protect = require('../middleware/authMiddleware');


console.log('uploadReceipt:', uploadReceipt);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/receipt', protect, upload.single('receipt'), uploadReceipt); // ✅ use

module.exports = router;
