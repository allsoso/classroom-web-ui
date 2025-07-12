import { api } from '../../lib/axios';

export async function listarVideos() {
    const response = await api.get('contents/video');
    return response.data;
}

export async function buscarVideoPorId(id) {
    const response = await api.get(`contents/video/${id}`);
    return response.data;
}
