import { api } from '../../lib/axios';


export async function signup(userData) {
    const response = await api.post('auth/signup', userData);
    return response.data;
}
