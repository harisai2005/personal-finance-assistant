const transactionController = require('../controllers/transactionController');
const Transaction = require('../models/transaction');

jest.mock('../models/transaction');

describe('Transaction Controller - Unit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a transaction', async () => {
    const req = {
      body: {
        type: 'income',
        category: 'Salary',
        amount: 1000,
        description: 'Monthly pay'
      },
      user: { _id: 'user123' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockTransaction = { ...req.body, userId: 'user123' };
    Transaction.create.mockResolvedValue(mockTransaction);

    await transactionController.addTransaction(req, res);

    expect(Transaction.create).toHaveBeenCalledWith({ ...req.body, userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTransaction);
  });

  it('should get user transactions', async () => {
    const req = {
      user: { _id: 'user123' },
      query: {}
    };
    const res = {
      json: jest.fn()
    };

    const transactions = [{ category: 'Food', amount: 200 }];
    Transaction.find.mockReturnValue({
      sort: jest.fn().mockReturnValue(transactions)
    });

    await transactionController.getTransactions(req, res);

    expect(Transaction.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  it('should return summary grouped by category', async () => {
    const req = {
      user: { _id: 'user123' }
    };
    const res = {
      json: jest.fn()
    };

    const summary = [{ _id: 'Food', total: 300 }];
    Transaction.aggregate.mockResolvedValue(summary);

    await transactionController.getSummary(req, res);

    expect(Transaction.aggregate).toHaveBeenCalledWith([
      { $match: { userId: 'user123' } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);
    expect(res.json).toHaveBeenCalledWith(summary);
  });
});
