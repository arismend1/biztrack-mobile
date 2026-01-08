import client from './client';

export const getEstimates = async () => {
    const response = await client.get('/estimates');
    return response.data;
};

export const createEstimate = async (data) => {
    const response = await client.post('/estimates', data);
    return response.data;
};

export const getEstimateById = async (id) => {
    const response = await client.get(`/estimates/${id}`);
    return response.data;
};

export const updateEstimate = async (id, data) => {
    const response = await client.put(`/estimates/${id}`, data);
    return response.data;
};

export const convertToInvoice = async (id) => {
    const response = await client.post(`/estimates/${id}/convert`);
    return response.data;
};
