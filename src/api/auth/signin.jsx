import { api } from '../../lib/axios';


export async function signin(credentials) {
    const response = await api.post('auth/signin', credentials);
    return response.data;
} 