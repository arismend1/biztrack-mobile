import client from './client';

export const getExpenses = async () => {
    const response = await client.get('/expenses');
    return response.data;
};

export const createExpense = async (data) => {
    const response = await client.post('/expenses', data);
    return response.data;
};

export const deleteExpense = async (id) => {
    const response = await client.delete(`/expenses/${id}`);
    return response.data;
};
