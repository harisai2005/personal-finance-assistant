const express = require('express');
const { addTransaction, getTransactions, getSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
