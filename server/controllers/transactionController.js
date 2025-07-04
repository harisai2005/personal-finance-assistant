const Transaction = require('../models/transaction');

exports.addTransaction = async (req, res) => {
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
