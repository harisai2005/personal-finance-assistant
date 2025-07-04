const authController = require('../controllers/authController');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

jest.mock('../models/user');
jest.mock('jsonwebtoken');

describe('Auth Controller - Unit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const req = {
      body: {
        name: 'Hari',
        email: 'hari@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '123', name: 'Hari' });
    jwt.sign.mockReturnValue('mocked-token');

    await authController.register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'hari@example.com' });
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ token: 'mocked-token' });
  });

  it('should not register if user exists', async () => {
    const req = {
      body: {
        name: 'Hari',
        email: 'hari@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue({ email: 'hari@example.com' });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should login user successfully', async () => {
    const req = {
      body: {
        email: 'hari@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(true),
      _id: 'user123'
    };

    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('login-token');

    await authController.login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'hari@example.com' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    expect(res.json).toHaveBeenCalledWith({ token: 'login-token' });
  });

  it('should not login with invalid credentials', async () => {
    const req = {
      body: {
        email: 'hari@example.com',
        password: 'wrongpass'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
});
