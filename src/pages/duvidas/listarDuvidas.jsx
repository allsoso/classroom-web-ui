import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { listarQuestions } from "../../api/duvidas/listar"
import { buscarUsuarioPorId } from "../../api/usuarios/buscarPorId"
import { buscarVideoPorId } from "../../api/aulas/listar"


export default function ListarDuvidas() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userNames, setUserNames] = useState({})
  const [aulas, setAulas] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const questionsData = await listarQuestions()
        setQuestions(questionsData)

        const userIds = new Set()
        const aulaIds = new Set()

        questionsData.forEach(question => {
          if (question.id_created_by) userIds.add(question.id_created_by)
          if (question.id_answered_by) userIds.add(question.id_answered_by)
          if (question.id_content) aulaIds.add(question.id_content)
        })

        const userNamesData = {}
        for (const userId of userIds) {
          try {
            const userData = await buscarUsuarioPorId(userId)
            userNamesData[userId] = userData.name || userData.nome || 'Usuário'
          } catch (err) {
            console.error(`Erro ao buscar usuário ${userId}:`, err)
            userNamesData[userId] = 'Usuário'
          }
        }
        setUserNames(userNamesData)

        const aulasData = {}
        for (const aulaId of aulaIds) {
          try {
            const aulaData = await buscarVideoPorId(aulaId)
            aulasData[aulaId] = aulaData
          } catch (err) {
            console.error(`Erro ao buscar aula ${aulaId}:`, err)
            aulasData[aulaId] = { title: 'Aula não encontrada' }
          }
        }
        setAulas(aulasData)



      } catch (err) {
        console.error('Erro ao buscar dúvidas:', err)
        setError('Erro ao carregar as dúvidas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const getQuestionTypeLabel = (type) => {
    return type === 'DUVIDA' ? 'Dúvida' : 'Comentário'
  }

  const getQuestionTypeColor = (type) => {
    return type === 'DUVIDA' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800'
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dúvidas</h1>
          <p className="text-muted-foreground">
            Carregando dúvidas...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dúvidas</h1>
          <p className="text-muted-foreground">
            Erro ao carregar dúvidas
          </p>
        </div>
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dúvidas</h1>
        <p className="text-muted-foreground">
          Tire suas dúvidas sobre o conteúdo
        </p>
      </div>

      <div className="max-w-4xl space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhuma dúvida encontrada.</p>
            <p className="text-muted-foreground">Seja o primeiro a fazer uma pergunta!</p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getQuestionTypeColor(question.type)}`}>
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    {question.private && (
                      <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                        Privado
                      </span>
                    )}
                    {question.content_position && (
                      <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-2 py-1 rounded">
                        {question.content_position}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                    {question.question?.trim() || 'Sem título'}
                  </h3>
                  
                    <div className="space-y-2 text-sm text-muted-foreground">
                     <div className="flex items-center gap-4">
                       <span>Por: <span className="font-medium">{userNames[question.id_created_by] || 'Usuário'}</span></span>
                       <span>Criado em: {formatDate(question.createdAt)}</span>
                     </div>
                    
                    {aulas[question.id_content] && (
                      <div>
                        <span>Aula: </span>
                        <Link 
                          to={`/aula/${question.id_content}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {aulas[question.id_content].title || `Aula ${question.id_content}`}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {question.answer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                      Resposta
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{question.answer}</p>
                                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
                     <span>Respondido por: <span className="font-medium">{userNames[question.id_answered_by] || 'Usuário'}</span></span>
                     <span>Respondido em: {formatDate(question.answeredAt)}</span>
                   </div>
                </div>
              )}

              {!question.answer && (
                <div className="mt-4">
                  <Link
                    to={`/duvidas/responder/${question.id}`}
                    className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Responder
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 