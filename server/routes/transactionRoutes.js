const express = require('express');
const {
  addTransaction,
  getTransactions,
  getSummary,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Auth middleware

router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

// ✅ Update & Delete routes
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
