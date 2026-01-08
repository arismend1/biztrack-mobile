import client from './client';

export const getCompany = async () => {
    const response = await client.get('/company');
    return response.data;
};

export const updateCompany = async (data) => {
    const response = await client.put('/company', data);
    return response.data;
};
