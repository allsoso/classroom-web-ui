import { api } from '../../lib/axios';


export async function listarQuestions() {
    const response = await api.get('questions');
    return response.data;
}


export async function listarQuestionsPorContent(contentId) {
    const response = await api.get(`questions/content/${contentId}`);
    return response.data;
}


export async function buscarQuestionPorId(id) {
    const response = await api.get(`questions/${id}`);
    return response.data;
}
