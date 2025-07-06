const transactionController = require('../controllers/transactionController');
const Transaction = require('../models/transaction');

jest.mock('../models/transaction');

describe('💼 Transaction Controller - Unit Tests', () => {
  afterEach(() => jest.clearAllMocks());

  it('should add a valid transaction', async () => {
    const req = {
      body: {
        type: 'income',
        category: 'Salary',
        amount: 1000,
        description: 'Monthly pay',
      },
      user: { _id: 'user123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockResult = { ...req.body, userId: req.user._id };
    Transaction.create.mockResolvedValue(mockResult);

    await transactionController.addTransaction(req, res);

    expect(Transaction.create).toHaveBeenCalledWith(mockResult);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('should return 400 if required fields are missing', async () => {
    const req = { body: { type: '', category: '', amount: null }, user: { _id: 'user123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await transactionController.addTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Type, category, and amount are required.' });
  });

  it('should retrieve user transactions', async () => {
    const req = { user: { _id: 'user123' }, query: {} };
    const res = { json: jest.fn() };

    const mockData = [{ category: 'Food', amount: 200 }];
    Transaction.countDocuments.mockResolvedValue(1);
    Transaction.find.mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => mockData,
        }),
      }),
    });

    await transactionController.getTransactions(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),
        currentPage: expect.any(Number),
        totalPages: expect.any(Number),
        totalCount: expect.any(Number),
      })
    );
  });

  it('should return summary including net income', async () => {
    const req = { user: { _id: 'user123' } };
    const res = { json: jest.fn() };

    Transaction.aggregate
      .mockResolvedValueOnce([{ _id: 'Food', total: 500 }]) // category breakdown
      .mockResolvedValueOnce([
        { _id: 'income', total: 1000 },
        { _id: 'expense', total: 500 },
      ]); // income vs expense

    await transactionController.getSummary(req, res);

    expect(Transaction.aggregate).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      totalIncome: 1000,
      totalExpenses: 500,
      netIncome: 500,
      categoryBreakdown: [{ _id: 'Food', total: 500 }],
    });
  });
});
