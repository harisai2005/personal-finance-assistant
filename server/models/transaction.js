const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: String,
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },
  receiptUrl: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);
