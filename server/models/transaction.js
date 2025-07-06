const mongoose = require('mongoose');

/**
 * Schema for user transactions (income/expense).
 */
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  receiptUrl: { type: String }, // Optional URL for receipt image
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
