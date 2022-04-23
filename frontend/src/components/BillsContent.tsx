import React, { useEffect, useState } from 'react';
import { Container, Col, Table, Form, Button } from 'react-bootstrap';
import BillingServiceAPIGateway from '../api/BillingService';
import { TablePaginator } from './TablePaginator';

interface BillsTableItemProps {
    orgName: string;
    clientName: string;
    number: string;
    sum: number;
    date: Date;
    ind: number;
}

const BillsTableItem: React.FC<BillsTableItemProps> = (props) => {
    return (
        <tr>
            <td>{props.ind}</td>
            <td>{props.orgName}</td>
            <td>{props.clientName}</td>
            <td>{props.number}</td>
            <td>{props.sum}</td>
            <td>{props.date.toString()}</td>
        </tr>
    );
}


interface BillsContentState {
    count: number,
    nextLink?: string,
    previousLink?: string,
    rows?: Array<any>,
    orgNameFilter?: string,
    clientNameFilter?: string,
}

interface BillsContentProps {
}

const BillsContent: React.FC<BillsContentProps> = (props) => {
    const [content, setContent] = useState<BillsContentState>({
        count: 0,
    });

    useEffect(() => {
        retrieveReportRows();
    }, []);

    // useEffect(() => {
    //     retrieveReportRows();
    // }, [content.orgNameFilter, content.clientNameFilter]);

    const retrieveReportRows = async (orgName?: string, clientName?: string) => {
        const response = await BillingServiceAPIGateway.getBillingReport(orgName, clientName);
        if (response) setContent(
            {
                count: response['count'],
                nextLink: response['next'],
                previousLink: response['previous'],
                rows: response['results']
            }
        );
    }

    const retrieveFromPagiLink = (url: string) => {
        return async (event: React.MouseEvent<HTMLElement>) => {
            const response = await BillingServiceAPIGateway.getByLink(url, content.orgNameFilter, content.clientNameFilter);
            if (response) setContent(
                {
                    count: response['count'],
                    nextLink: response['next'],
                    previousLink: response['previous'],
                    rows: response['results']
                }
            );
        }
    }

    const handleChange = (event: any) => {
        switch (event.target.id.toString()) {
            case 'org-name':
                setContent({ ...content, orgNameFilter: event.target.value });
                break;
            case 'client-name':
                setContent({ ...content, clientNameFilter: event.target.value });
                break;
            default:
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        retrieveReportRows(content.orgNameFilter, content.clientNameFilter);
    };

    return (
        <Container>
            <Form style={{ marginTop: 20, marginBottom: 20 }} onChange={handleChange} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="org-name">
                    <Form.Label>Organization name</Form.Label>
                    <Form.Control type="text" placeholder="Enter org name" />
                    <Form.Text className="text-muted">
                        Filter by organization name.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="client-name">
                    <Form.Label>Client name</Form.Label>
                    <Form.Control type="text" placeholder="Enter client name" />
                    <Form.Text className="text-muted">
                        Filter by client name.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Col>
                <TablePaginator nextLink={content.nextLink} previousLink={content.previousLink} buttonHandler={retrieveFromPagiLink} />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Organization name</th>
                            <th>Client name</th>
                            <th>Number</th>
                            <th>Sum</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            content.rows ? content.rows.map((val, ind) => (
                                <BillsTableItem
                                    key={ind}
                                    orgName={val['organization_name']}
                                    clientName={val['client_name']}
                                    number={val['number']}
                                    sum={val['sum']}
                                    ind={val['pk']}
                                    date={val['date']}
                                />
                            )) : null
                        }
                    </tbody>
                </Table>
            </Col>
        </Container>
    );
};


export { BillsContent };