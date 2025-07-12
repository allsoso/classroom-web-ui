import { api } from '../../lib/axios'

export async function responderDuvida(id_question, answer) {
  const response = await api.patch(`/questions/${id_question}/answer`, {
    answer
  })
  return response.data
} 