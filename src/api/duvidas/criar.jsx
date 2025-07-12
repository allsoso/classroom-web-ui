import { api } from '../../lib/axios';

export async function createQuestion(questionData) {
    const response = await api.post('questions', questionData);
    return response.data;
}
