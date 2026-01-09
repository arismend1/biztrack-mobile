import client from './client';

export const getClients = async () => {
    const response = await client.get('/clients');
    return response.data;
};

export const createClient = async (data) => {
    const response = await client.post('/clients', data);
    return response.data;
};

export const getClientById = async (id) => {
    const response = await client.get(`/clients/${id}`);
    return response.data;
};

export const updateClient = async (id, data) => {
    const response = await client.put(`/clients/${id}`, data);
    return response.data;
};

export const deleteClient = async (id) => {
    const response = await client.delete(`/clients/${id}`);
    return response.data;
};
