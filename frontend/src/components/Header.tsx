import React from 'react';
import { Nav } from 'react-bootstrap';

enum HeaderActiveKey {
    Home = 1,
    LoadReports,
    ClientOrgsReport,
    BillsReport,
}

interface HeaderProps {
    activeKey: HeaderActiveKey;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <Nav justify variant="pills" defaultActiveKey={props.activeKey ? props.activeKey : HeaderActiveKey.Home}>
            <Nav.Item>
                <Nav.Link eventKey={HeaderActiveKey.LoadReports} href="/load">Load files</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={HeaderActiveKey.ClientOrgsReport} href="/clients">Client organisations report</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={HeaderActiveKey.BillsReport} href="/bills">Bills report</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export { Header, HeaderActiveKey };