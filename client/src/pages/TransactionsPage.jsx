import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Pagination } from 'react-bootstrap';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const fetchData = async (page = 1) => {
    const res = await getTransactions('2024-01-01', '2025-12-31', page, ITEMS_PER_PAGE);
    setTransactions(res.data.data || []);
    setCurrentPage(res.data.currentPage);
    setTotalPages(res.data.totalPages);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData(currentPage);
  };

  const handleEdit = (txn) => {
    localStorage.setItem('edit_txn', JSON.stringify(txn));
    navigate('/add');
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const renderPagination = () => {
    const items = [];

    if (currentPage > 1) {
      items.push(<Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />);
    }

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(<Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />);
    }

    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm p-3">
        <h4>All Transactions</h4>
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover className="mt-3" style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th style={{ position: 'sticky', right: 0, backgroundColor: '#f8f9fa', zIndex: 2 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={txn._id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>{txn.category}</td>
                  <td className={txn.type === 'income' ? 'text-success' : 'text-danger'}>
                    {txn.type}
                  </td>
                  <td>{formatINR(txn.amount)}</td>
                  <td
                    style={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: '#f8f9fa',
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(txn)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(txn._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && renderPagination()}
      </Card>
    </Container>
  );
};

export default TransactionsPage;
