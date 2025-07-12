import { api } from '../../lib/axios';

export async function createVideo(videoData) {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    
    const response = await api.post('contents/video', videoData, config);
    return response.data;
}
