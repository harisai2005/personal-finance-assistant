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
const auth = require('../middleware/authMiddleware'); // Ensure this is the correct path to your auth middleware


const router = express.Router();

router.use(protect); // Auth middleware

router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

// ✅ Update & Delete routes
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/daily', auth, getDailyExpenses);
router.get('/summary', auth, getSummary);

module.exports = router;
