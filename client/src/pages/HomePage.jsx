import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSummary, getTransactions } from "../services/transactionService";
import { ArrowUpRight, ArrowDownLeft, Wallet, List } from "lucide-react";
import Graphs from "../components/Graphs";

const HomePage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sumRes = await getSummary();
        const txnRes = await getTransactions("2024-01-01", "2025-12-31", 1, 3); // Show 3 previews

        const income = sumRes.data?.totalIncome || 0;
        const expenses = sumRes.data?.totalExpenses || 0;
        const net = sumRes.data?.netIncome ?? (income - expenses);

        setSummary({ income, expenses, net });
        setTransactions(Array.isArray(txnRes?.data?.data) ? txnRes.data.data : []);
        setTransactionCount(txnRes?.data?.totalCount || 0);
      } catch (err) {
        console.error("❌ Fetch error:", err?.response?.data || err.message);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/auth");
      }
    };

    fetchData();
  }, [navigate]);

  const StatCard = ({ title, value, icon }) => (
    <Card className="shadow-sm p-3 mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted">{title}</div>
          <h4 className="mb-0">{value}</h4>
        </div>
        <div className="text-primary fs-3">{icon}</div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="mt-4">
      {/* Summary cards */}
      <Row className="mb-3">
        <Col md={3}><StatCard title="Total Income" value={formatINR(summary.income)} icon={<ArrowDownLeft />} /></Col>
        <Col md={3}><StatCard title="Total Expenses" value={formatINR(summary.expenses)} icon={<ArrowUpRight />} /></Col>
        <Col md={3}><StatCard title="Net Income" value={formatINR(summary.net)} icon={<Wallet />} /></Col>
        <Col md={3}><StatCard title="Transactions" value={transactionCount} icon={<List />} /></Col>
      </Row>

      {/* Recent Transactions + Quick Actions */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header><strong>Recent Transactions</strong></Card.Header>
            <Card.Body>
              <ListGroup>
                {transactions.map((t, i) => (
                  <ListGroup.Item key={i} className="d-flex justify-content-between">
                    <div>
                      <strong>{t.description || "No description"}</strong><br />
                      <small className="text-muted">{new Date(t.date).toDateString()}</small>
                    </div>
                    <strong className={t.type === "income" ? "text-success" : "text-danger"}>
                      {t.type === "income" ? "+" : "-"}{formatINR(Math.abs(t.amount))}
                    </strong>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header><strong>Quick Actions</strong></Card.Header>
            <Card.Body>
              <Button className="w-100 mb-2" variant="info" onClick={() => navigate("/add")}>➕ Add New Transaction</Button>
              <Button className="w-100 mb-2" variant="info" onClick={() => navigate("/analytics")}>📊 View Analytics</Button>
              <Button className="w-100 mb-2" variant="info" onClick={() => navigate("/transactions")}>📁 View Transactions</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Visual Summary */}
      <Row>
        <Col>
          <Card className="shadow-sm p-4">
            <h5 className="mb-3">Visual Summary</h5>
            <Graphs />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
