import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Graphs from '../components/Graphs';

const AnalyticsPage = () => {
  return (
    <Container className="mt-4">
      <Card className="shadow-sm p-4">
        <h4>Analytics</h4>
        <p className="text-muted">Track your expenses visually</p>
        <Graphs />
      </Card>
    </Container>
  );
};

export default AnalyticsPage;
