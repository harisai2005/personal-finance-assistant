const Transaction = require('../models/transaction');

/**
 * Adds a new transaction for the authenticated user
 */
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount } = req.body;

    if (!type || !category || amount == null) {
      return res.status(400).json({ error: 'Type, category, and amount are required.' });
    }

    const transaction = await Transaction.create({ ...req.body, userId: req.user._id });
    res.status(201).json(transaction);
  } catch (err) {
    console.error('❌ Add transaction error:', err);
    res.status(500).json({ message: 'Server error while adding transaction' });
  }
};

/**
 * Retrieves paginated transactions in a given date range
 */
exports.getTransactions = async (req, res) => {
  try {
    const { start, end, page = 1, limit = 10 } = req.query;

    const filter = {
      userId: req.user._id,
      ...(start && end && { date: { $gte: new Date(start), $lte: new Date(end) } }),
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
      totalCount: total
    });
  } catch (err) {
    console.error('❌ Get transactions error:', err);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
};

/**
 * Returns category-wise and income-expense summary for user
 */
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const totals = await Transaction.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      categoryBreakdown,
    };

    totals.forEach(({ _id, total }) => {
      if (_id === 'income') summary.totalIncome = total;
      else if (_id === 'expense') summary.totalExpenses = total;
    });

    summary.netIncome = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (err) {
    console.error('❌ Get summary error:', err);
    res.status(500).json({ message: 'Server error while generating summary' });
  }
};

/**
 * Updates an existing transaction
 */
exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Transaction not found' });

    res.json(updated);
  } catch (err) {
    console.error('❌ Update transaction error:', err);
    res.status(500).json({ message: 'Server error while updating transaction' });
  }
};

/**
 * Deletes a transaction by ID
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('❌ Delete transaction error:', err);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
};

/**
 * Returns last 7 days daily expenses
 */
exports.getDailyExpenses = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

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

    const result = data.map(item => ({ date: item._id, amount: item.amount }));

    res.json(result);
  } catch (err) {
    console.error('❌ Daily expenses error:', err);
    res.status(500).json({ message: 'Server error while fetching daily expenses' });
  }
};
