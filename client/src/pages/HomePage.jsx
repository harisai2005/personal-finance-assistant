import React, { useEffect, useState } from 'react';
import { addTransaction, getTransactions, getSummary } from '../services/transactionService';
import { useNavigate } from 'react-router-dom';
import Graphs from '../components/Graphs';

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: ''
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const trans = await getTransactions('2024-01-01', '2025-12-31');
      const sum = await getSummary();
      setTransactions(trans.data);
      setSummary(sum.data);
    } catch (err) {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/auth');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(form);
    setForm({ type: 'expense', category: '', amount: '', description: '', date: '' });
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h3>Add Transaction</h3>
      <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-2">
          <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="col-md-1">
          <button className="btn btn-success w-100" type="submit">➕</button>
        </div>
      </form>

      <hr />
      <h4>Transactions</h4>
      <ul className="list-group">
        {transactions.map((t, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            <span>{t.type.toUpperCase()} - {t.category} - ₹{t.amount}</span>
            <span>{new Date(t.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>

      <hr />
      <h4>Summary</h4>
      <ul className="list-group">
        {summary.map((s, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            <span>{s._id}</span>
            <span>₹{s.total}</span>
          </li>
        ))}
      </ul>

      <hr />
      <h4>Visual Summary</h4>
      <Graphs data={summary} />
    </div>
  );
};

export default HomePage;
