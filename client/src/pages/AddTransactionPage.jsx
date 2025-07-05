import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../services/transactionService';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(form);
    navigate('/');
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile) return alert("Please select a receipt to upload.");
    setUploading(true);
    try {
      const res = await uploadReceipt(receiptFile);
      const data = res.data.extractedData;

      setForm({
        ...form,
        amount: data.amount || '',
        category: data.category || '',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        type: 'expense',
      });
    } catch (err) {
      alert("Failed to extract from receipt.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow p-4">
        <h4>Add New Transaction</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Upload Receipt (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceiptFile(e.target.files[0])}
            />
            <Button
              className="mt-2"
              variant="outline-primary"
              onClick={handleReceiptUpload}
              disabled={uploading}
            >
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

          <Button variant="success" type="submit">Add Transaction</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddTransactionPage;
