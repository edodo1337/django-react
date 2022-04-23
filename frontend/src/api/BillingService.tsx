import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class BillingServiceAPIGateway {

    constructor() { }

    static async getByLink(url: string, orgName?: string, clientName?: string) {
        let _url = new URL(url);

        if (orgName) {
            _url.searchParams.append('organization__name', orgName);
        }
        if (clientName) {
            _url.searchParams.append('organization__client__name', clientName);
        }

        return axios.get(_url.toString()).then(response => response.data);
    }

    static async getBillingReport(orgName?: string, clientName?: string) {
        let url = new URL(`${API_URL}/billing/bills/report/`);

        if (orgName) {
            url.searchParams.append('organization__name', orgName);
        }
        if (clientName) {
            url.searchParams.append('organization__client__name', clientName);
        }

        return axios.get(url.toString()).then(response => response.data);
    }

    static async getClientOrgsAggregatedReport() {
        const url = new URL(`${API_URL}/billing/clients/report/`);
        return axios.get(url.toString()).then(response => response.data);
    }


    static async uploadClientOrgsReport(form: FormData) {
        const url = new URL(`${API_URL}/billing/upload_client_orgs/`);
        return axios.post(url.toString(), form);
    }

    static async uploadBillsReport(form: FormData) {
        const url = new URL(`${API_URL}/billing/upload_bills/`);
        return axios.post(url.toString(), form);
    }

    // getCustomersByURL(link) {
    //     const url = `${API_URL}${link}`;
    //     return axios.get(url).then(response => response.data);
    // }
    // getCustomer(pk) {
    //     const url = `${API_URL}/api/customers/${pk}`;
    //     return axios.get(url).then(response => response.data);
    // }
    // deleteCustomer(customer) {
    //     const url = `${API_URL}/api/customers/${customer.pk}`;
    //     return axios.delete(url);
    // }
    // createCustomer(customer) {
    //     const url = `${API_URL}/api/customers/`;
    //     return axios.post(url, customer);
    // }
    // updateCustomer(customer) {
    //     const url = `${API_URL}/api/customers/${customer.pk}`;
    //     return axios.put(url, customer);
    // }
}