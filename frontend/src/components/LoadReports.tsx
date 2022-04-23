import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Col, Table, Form, Button, Row, Alert } from 'react-bootstrap';
import BillingServiceAPIGateway from '../api/BillingService';
import { TablePaginator } from './TablePaginator';


interface LoadClienOrgsProps {
}

interface LoadClienOrgsState {
    file?: File;
    displayAlert: boolean;
    success: boolean;
    errMsg: string;
    disabled: boolean;
}


const LoadClienOrgs: React.FC<LoadClienOrgsProps> = (props) => {

    const [formState, setFormState] = useState<LoadClienOrgsState>({ displayAlert: false, success: false, errMsg: "", disabled: false });

    const handleChange = (event: any) => {
        setFormState({ ...formState, file: event.target.files[0] });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if (!formState.file) return;
        const formData = new FormData();
        formData.append("file", formState.file);

        BillingServiceAPIGateway
            .uploadClientOrgsReport(formData)
            .then(() => {
                setFormState({ displayAlert: true, success: true, errMsg: "", file: undefined, disabled: true });
                setTimeout(() => {
                    setFormState({ displayAlert: false, success: false, errMsg: "", file: undefined, disabled: false })
                }, 2000);
            })
            .catch((e: AxiosError) => {
                setFormState({ displayAlert: true, success: false, errMsg: e.response?.data['file'], disabled: true });
                setTimeout(() => {
                    setFormState({ displayAlert: false, success: false, errMsg: "", file: undefined, disabled: false })
                }, 2000);
            })
    };


    return (
        <Form style={{ marginTop: 20, marginBottom: 20 }} onChange={handleChange} onSubmit={handleSubmit}>
            <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Load client organizations report</Form.Label>
                <Form.Control type="file" size="lg" />
            </Form.Group>
            {
                formState.displayAlert ?
                    <Alert variant={formState.success ? "success" : "danger"}>
                        {formState.success ? "File has loaded" : formState.errMsg}
                    </Alert>
                    : null
            }
            <Button variant="primary" type="submit" disabled={formState.disabled}>
                Submit
            </Button>
        </Form >
    );
}

interface LoadBillsProps {
}

interface LoadBillsState {
    file?: File;
    displayAlert: boolean;
    success: boolean;
    errMsg: string;
    disabled: boolean;
}


const LoadBills: React.FC<LoadBillsProps> = (props) => {

    const [formState, setFormState] = useState<LoadBillsState>({ displayAlert: false, success: false, errMsg: "", disabled: false });


    const handleChange = (event: any) => {
        setFormState({ ...formState, file: event.target.files[0] });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if (!formState.file) return;
        const formData = new FormData();
        formData.append("file", formState.file);

        BillingServiceAPIGateway
            .uploadBillsReport(formData)
            .then(() => {
                setFormState({ displayAlert: true, success: true, errMsg: "", file: undefined, disabled: true })
                setTimeout(() => {
                    setFormState({ displayAlert: false, success: false, errMsg: "", file: undefined, disabled: false })
                }, 2000);
            })
            .catch((e: AxiosError) => {
                setFormState({ displayAlert: true, success: false, errMsg: e.response?.data['file'], disabled: true });
                setTimeout(() => {
                    setFormState({ displayAlert: false, success: false, errMsg: "", file: undefined, disabled: false })
                }, 2000);
            })
    };


    return (
        <Form style={{ marginTop: 20, marginBottom: 20 }} onChange={handleChange} onSubmit={handleSubmit}>
            <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Load bills report</Form.Label>
                <Form.Control type="file" size="lg" />
            </Form.Group>
            {
                formState.displayAlert ?
                    <Alert variant={formState.success ? "success" : "danger"}>
                        {formState.success ? "File has loaded" : formState.errMsg}
                    </Alert>
                    : null
            }
            <Button variant="primary" type="submit" disabled={formState.disabled}>
                Submit
            </Button>
        </Form >
    );
}

interface LoadReportsProps {
}

const LoadReports: React.FC<LoadReportsProps> = (props) => {
    return (
        <Container>
            <Row>
                <LoadBills />
            </Row>
            <Row>
                <LoadClienOrgs />
            </Row>
        </Container>
    );
}


export { LoadReports };