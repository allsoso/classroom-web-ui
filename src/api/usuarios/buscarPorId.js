import { api } from '../../lib/axios';

export async function buscarUsuarioPorId(id) {
    const response = await api.get(`users/${id}`);
    return response.data;
} 