const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS configuration for Vercel frontend
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://personal-finance-assistant-nine.vercel.app', // ✅ your actual deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
