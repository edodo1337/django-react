import React from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Header, HeaderActiveKey } from './components/Header';
import { ClientOrgsContent } from './components/ClientOrgsContent';
import { BillsContent } from './components/BillsContent';
import { LoadReports } from './components/LoadReports';


interface ClientOrgsReportLayoutProps {
}

const ClientOrgsReportLayout: React.FC<ClientOrgsReportLayoutProps> = (props) => {
  return (
    <Container>
      <Col xs={1}></Col>
      <Col xs={9} className="m-auto">
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <Header activeKey={HeaderActiveKey.ClientOrgsReport} />
        </Row>
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <ClientOrgsContent />
        </Row>
      </Col>
      <Col xs={1}></Col>
    </Container>
  );
}


interface BillsReportLayoutProps {
}

const BillsReportLayout: React.FC<BillsReportLayoutProps> = (props) => {
  return (
    <Container>
      <Col xs={1}></Col>
      <Col xs={9} className="m-auto">
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <Header activeKey={HeaderActiveKey.BillsReport} />
        </Row>
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <BillsContent />
        </Row>
      </Col>
      <Col xs={1}></Col>
    </Container>
  );
}


interface LoadClientsOrgssLayoutProps {
}

const LoadClientsOrgssLayout: React.FC<LoadClientsOrgssLayoutProps> = (props) => {
  return (
    <Container>
      <Col xs={1}></Col>
      <Col xs={9} className="m-auto">
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <Header activeKey={HeaderActiveKey.LoadReports} />
        </Row>
        <Row style={{ marginTop: 20, marginBottom: 20 }}>
          <LoadReports />
        </Row>
      </Col>
      <Col xs={1}></Col>
    </Container>
  );
}



function App() {
  return (
    <h1>hello</h1>
  );
}

export default App;
export { ClientOrgsReportLayout, BillsReportLayout, LoadClientsOrgssLayout }