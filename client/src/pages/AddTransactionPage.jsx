import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addTransaction, updateTransaction } from '../services/transactionService';
import { uploadReceipt } from '../services/uploadService';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [mode, setMode] = useState('pos');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('edit_txn');
    if (saved) {
      const txn = JSON.parse(saved);
      setForm({
        amount: txn.amount,
        type: txn.type,
        category: txn.category,
        description: txn.description,
        date: txn.date.split('T')[0],
      });
      setEditId(txn._id);
      setIsEditing(true);
      localStorage.removeItem('edit_txn');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.amount || Number(form.amount) <= 0) return 'Amount must be greater than zero.';
    if (!form.category.trim()) return 'Category is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (!form.date) return 'Date is required.';
    if (new Date(form.date) > new Date()) return 'Date cannot be in the future.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError('');

    try {
      if (isEditing) {
        await updateTransaction(editId, form);
      } else {
        await addTransaction(form);
      }
      navigate('/transactions'); // Redirect to transaction list after adding/updating
    } catch (err) {
      setError(isEditing ? 'Failed to update transaction.' : 'Failed to add transaction.');
    }
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile) return alert("Please select a receipt to upload.");
    setUploading(true);
    try {
      const res = await uploadReceipt(receiptFile, mode);
      if (mode === 'history') {
        setModalMessage(`✅ ${res.data.insertedCount || 0} transactions added.`);
        setShowModal(true);
      } else {
        const data = res.data.extractedData;
        setForm({
          ...form,
          amount: data.amount || '',
          category: data.category || '',
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          type: 'expense',
        });
        setModalMessage('✅ POS transaction extracted successfully.');
        setShowModal(true);
      }
    } catch (err) {
      alert("Failed to extract from receipt.");
    } finally {
      setUploading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/transactions'); // 👈 Redirect to transaction list after modal close
  };

  return (
    <Container className="mt-4">
      <Card className="shadow p-4">
        <h4>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Upload Receipt (optional)</Form.Label>
            <Form.Control type="file" accept="image/*,.pdf" onChange={(e) => setReceiptFile(e.target.files[0])} />
            <div className="mt-2">
              <Form.Check
                type="radio"
                inline
                label="POS Receipt"
                checked={mode === 'pos'}
                onChange={() => setMode('pos')}
              />
              <Form.Check
                type="radio"
                inline
                label="Transaction History"
                checked={mode === 'history'}
                onChange={() => setMode('history')}
              />
            </div>
            <Button className="mt-2" variant="outline-primary" onClick={handleReceiptUpload} disabled={uploading}>
              {uploading ? "Extracting..." : "Extract from Receipt"}
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" name="amount" value={form.amount} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" value={form.category} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" name="description" value={form.description} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
          </Form.Group>

          <Button variant="success" type="submit">
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </Form>
      </Card>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Receipt Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddTransactionPage;
