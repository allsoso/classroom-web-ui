import { api } from '../../lib/axios';

export async function getClassrooms() {
    const response = await api.get('classroom');
    return response.data;
}
