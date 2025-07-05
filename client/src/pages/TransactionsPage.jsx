import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { getTransactions, deleteTransaction } from '../services/transactionService';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const fetchData = async () => {
    const res = await getTransactions('2024-01-01', '2025-12-31');
    setTransactions(res.data || []);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm p-3">
        <h4>All Transactions</h4>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={txn._id}>
                <td>{idx + 1}</td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.description}</td>
                <td>{txn.category}</td>
                <td className={txn.type === 'income' ? 'text-success' : 'text-danger'}>
                  {txn.type}
                </td>
                <td>{formatINR(txn.amount)}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(txn._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default TransactionsPage;
