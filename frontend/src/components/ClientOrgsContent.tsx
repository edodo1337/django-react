import React, { useEffect, useState } from 'react';
import { Container, Col, Table, Form, Button } from 'react-bootstrap';
import BillingServiceAPIGateway from '../api/BillingService';
import { TablePaginator } from './TablePaginator';

interface ClientOrgsTableItemProps {
    clientName: string;
    orgsCount: number;
    billsSum: number;
    ind: number;
}

const ClientOrgsTableItem: React.FC<ClientOrgsTableItemProps> = (props) => {
    return (
        <tr>
            <td>{props.ind}</td>
            <td>{props.clientName}</td>
            <td>{props.orgsCount}</td>
            <td>{props.billsSum}</td>
        </tr>
    );
}


interface ClientOrgsContentState {
    count: number,
    nextLink?: string,
    previousLink?: string,
    rows?: Array<any>
}

interface ClientOrgsContentProps {
}

const ClientOrgsContent: React.FC<ClientOrgsContentProps> = (props) => {

    const [content, setContent] = useState<ClientOrgsContentState>({
        count: 0,
    });

    const retrieveReportRows = async () => {
        const response = await BillingServiceAPIGateway.getClientOrgsAggregatedReport();
        if (response) setContent(
            {
                count: response['count'],
                nextLink: response['next'],
                previousLink: response['previous'],
                rows: response['results']
            }
        );
        console.log("State", response);
    }

    const retrieveFromPagiLink = (url: string) => {
        return async (event: React.MouseEvent<HTMLElement>) => {
            const response = await BillingServiceAPIGateway.getByLink(url);
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

    useEffect(() => {
        retrieveReportRows();
    }, []);

    return (
        <Container>
            <Col>
                <TablePaginator nextLink={content.nextLink} previousLink={content.previousLink} buttonHandler={retrieveFromPagiLink} />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client name</th>
                            <th>Organizations count</th>
                            <th>Bills sum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            content.rows ? content.rows.map((val, ind) => (
                                <ClientOrgsTableItem
                                    key={ind}
                                    clientName={val['name']}
                                    orgsCount={val['orgs_count']}
                                    billsSum={val['bills_sum']}
                                    ind={val['pk']}
                                />
                            )) : null
                        }
                    </tbody>
                </Table>
            </Col>
        </Container>
    );
};


export { ClientOrgsContent };