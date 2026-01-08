import client from './client';

export const getInvoices = async () => {
    const response = await client.get('/invoices');
    return response.data;
};

export const getInvoiceById = async (id) => {
    const response = await client.get(`/invoices/${id}`);
    return response.data;
};

export const registerPayment = async (id, data) => {
    const response = await client.post(`/invoices/${id}/payment`, data);
    return response.data;
};
