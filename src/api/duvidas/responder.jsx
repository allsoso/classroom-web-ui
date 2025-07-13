import { api } from '../../lib/axios'
import { getUserData, isUserAuthenticated } from '../../lib/auth'

export async function responderDuvida(id_question, answer) {
  if (!isUserAuthenticated()) {
    throw new Error('Usuário não está autenticado. Por favor, faça login primeiro.');
  }
  
  const userData = getUserData();

  const response = await api.patch(`/questions/${id_question}/answer`, {
    answer,
    id_answered_by: userData.id
  })
  return response.data
} 