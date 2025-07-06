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
  try {
    const { start, end, page = 1, limit = 10 } = req.query;

    const filter = {
      userId: req.user._id,
      ...(start && end && {
        date: { $gte: new Date(start), $lte: new Date(end) }
      })
    };

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      data: transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalCount: total // ✅ Return total count explicitly
    });
  } catch (err) {
    console.error("❌ getTransactions error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};



// controllers/transactionController.js
exports.getSummary = async (req, res) => {
  try {
    // Group by category for only expenses
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense', // ✅ Only expenses
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Overall income vs expense summary
    const totals = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      categoryBreakdown,
    };

    totals.forEach((entry) => {
      if (entry._id === 'income') summary.totalIncome = entry.total;
      if (entry._id === 'expense') summary.totalExpenses = entry.total;
    });

    summary.netIncome = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (err) {
    console.error("❌ getSummary error:", err);
    res.status(500).json({ message: "Server Error" });
  }
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

exports.getDailyExpenses = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days

    const data = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = data.map(item => ({
      date: item._id,
      amount: item.amount
    }));

    res.json(result);
  } catch (err) {
    console.error('Error in getDailyExpenses:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
