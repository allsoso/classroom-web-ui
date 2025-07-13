import { api } from '../../lib/axios';
import { getUserData, isUserAuthenticated } from '../../lib/auth';

export async function createQuestion(questionData) {
    if (!isUserAuthenticated()) {
        throw new Error('Usuário não está autenticado. Por favor, faça login primeiro.');
    }
    
    const userData = getUserData();

    const dataWithUserId = {
        ...questionData,
        id_created_by: userData.id
    };
    
    const response = await api.post('questions', dataWithUserId);
    return response.data;
}
