import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import API from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#F5B041'];

const Graphs = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [error, setError] = useState('');

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await API.get('/transactions/summary');
        const dailyRes = await API.get('/transactions/daily');

        // ✅ Get only the category breakdown for pie chart
        const categoryFormatted = categoryRes.data.categoryBreakdown
          .filter((item) => item.total > 0)
          .map((item) => ({
            category: item._id || 'Unknown',
            value: item.total,
          }));

        setCategoryData(categoryFormatted);
        setDailyData(dailyRes.data || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics.');
      }
    };

    fetchData();
  }, []);

  return (
    <Row>
      <Col md={6} className="mb-4">
        <h6 className="text-center">Expenses by Category</h6>
        {error ? (
          <p className="text-danger text-center">{error}</p>
        ) : categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, value }) =>
                  `${category}: ${formatINR(value)}`
                }
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatINR(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center">No category data found.</p>
        )}
      </Col>

      <Col md={6} className="mb-4">
        <h6 className="text-center">Daily Expenses (Last 7 Days)</h6>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatINR(value)} />
              <Tooltip formatter={(value) => formatINR(value)} />
              <Bar dataKey="amount" fill="#FF4C4C" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center">No daily expenses data found.</p>
        )}
      </Col>
    </Row>
  );
};

export default Graphs;
