const express = require('express');
const {
  addTransaction,
  getTransactions,
  getSummary,
  updateTransaction,
  deleteTransaction,
  getDailyExpenses
} = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all transaction routes
router.use(protect);

/**
 * @route   POST /api/transactions
 * @desc    Add a new transaction
 */
router.post('/', addTransaction);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions (with optional date range and pagination)
 */
router.get('/', getTransactions);

/**
 * @route   GET /api/transactions/summary
 * @desc    Get income vs expense and category breakdown
 */
router.get('/summary', getSummary);

/**
 * @route   GET /api/transactions/daily
 * @desc    Get last 7 days daily expenses
 */
router.get('/daily', getDailyExpenses);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a transaction
 */
router.put('/:id', updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 */
router.delete('/:id', deleteTransaction);

module.exports = router;
