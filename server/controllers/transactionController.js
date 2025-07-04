const Transaction = require('../models/transaction');

exports.addTransaction = async (req, res) => {
  const { type, category, amount } = req.body;
  if (!type || !category || amount == null) {
    return res.status(400).json({ error: 'Type, category, and amount are required.' });
  }
  const transaction = await Transaction.create({ ...req.body, userId: req.user._id });
  res.status(201).json(transaction);
};

exports.getTransactions = async (req, res) => {
  const { start, end } = req.query;
  const filter = {
    userId: req.user._id,
    ...(start && end && {
      date: { $gte: new Date(start), $lte: new Date(end) }
    })
  };
  const transactions = await Transaction.find(filter).sort({ date: -1 });
  res.json(transactions);
};

exports.getSummary = async (req, res) => {
  const result = await Transaction.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
  res.json(result);
};

exports.updateTransaction = async (req, res) => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Transaction not found' });
  res.json(updated);
};

exports.deleteTransaction = async (req, res) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Transaction deleted successfully' });
};
