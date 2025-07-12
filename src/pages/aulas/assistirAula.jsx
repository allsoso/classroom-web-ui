import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { buscarVideoPorId } from "../../api/aulas/listar"
import { listarQuestionsPorContent } from "../../api/duvidas/listar"
import { createQuestion } from "../../api/duvidas/criar"
import { VideoPlayer } from "../../components/ui/video-player"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function AssistirAula() {
  const { id } = useParams()
  const [aula, setAula] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "DUVIDA",
    private: false,
    content_position: "0:00",
    id_content: null
  })

  useEffect(() => {
    const fetchAula = async () => {
      try {
        setLoading(true)
        console.log('Fazendo requisição para buscar aula com ID:', id)
        const data = await buscarVideoPorId(id)
        console.log('Dados da aula recebidos:', data)
        setAula(data)
        
        if (data.url) {
          console.log('URL do vídeo encontrada:', data.url)
          setVideoUrl(data.url)
        } else {
          console.warn('URL do vídeo não encontrada na resposta da API')
          console.log('Estrutura completa da resposta:', data)
        }
        
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar aula:', err)
        console.error('Detalhes do erro:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        setError('Erro ao carregar a aula. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAula()
    }
  }, [id])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return
      
      try {
        setLoadingQuestions(true)
        const data = await listarQuestionsPorContent(id)
        setQuestions(data)
      } catch (err) {
        console.error('Erro ao buscar questions:', err)
        console.error('Detalhes do erro:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
      } finally {
        setLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, [id])

  const handleVideoError = (e) => {
    console.error('Erro ao carregar o vídeo:', videoUrl, e)
  }

  const handleVideoLoad = () => {
    console.log('Vídeo carregado com sucesso:', videoUrl)
  }

  const handleTimeUpdate = (currentTime) => {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
    setCurrentTime(timeString)
    
    if (showCreateForm) {
      setNewQuestion(prev => ({
        ...prev,
        content_position: timeString
      }))
    }
  }

  const handleCreateQuestion = async (e) => {
    e.preventDefault()
    
    if (!newQuestion.question.trim()) {
      alert('Por favor, insira sua dúvida.')
      return
    }

    try {
      const questionData = {
        ...newQuestion,
        id_content: parseInt(id)
      }
      
      const createdQuestion = await createQuestion(questionData)
      console.log('Question criada:', createdQuestion)
      
      const updatedQuestions = await listarQuestionsPorContent(id)
      setQuestions(updatedQuestions)
      
      setNewQuestion({
        question: "",
        type: "DUVIDA",
        private: false,
        content_position: currentTime,
        id_content: null
      })
      setShowCreateForm(false)
    } catch (err) {
      console.error('Erro ao criar question:', err)
      alert('Erro ao criar dúvida. Tente novamente.')
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return "0:00"
    return timeString
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-destructive">{error}</p>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Tentar novamente
            </button>
            <button 
              onClick={() => {
                console.log('Testando API...')
                buscarVideoPorId(id).then(data => {
                  console.log('Teste da API bem-sucedido:', data)
                  alert('API funcionando! Verifique o console para detalhes.')
                }).catch(err => {
                  console.error('Teste da API falhou:', err)
                  alert('API com erro! Verifique o console para detalhes.')
                })
              }}
              className="ml-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Testar API
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!aula) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aula não encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{aula.title || 'Assistir Aula'}</h1>
        <p className="text-muted-foreground text-lg">
          {aula.content || `Aula ID: ${id}`}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <VideoPlayer
            src={videoUrl}
            title={aula?.title || `Aula ${id}`}
            onError={handleVideoError}
            onLoad={handleVideoLoad}
            onTimeUpdate={handleTimeUpdate}
            showDebugInfo={true}
            className="mb-4"
          />

        </div>

        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dúvidas e Comentários</h3>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
            >
              {showCreateForm ? 'Cancelar' : '+ Nova Dúvida'}
            </Button>
          </div>

          {showCreateForm && (
            <div className="p-4 border rounded-lg bg-background">
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minuto atual: {currentTime}
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 8:10"
                    value={newQuestion.content_position}
                    onChange={(e) => setNewQuestion(prev => ({
                      ...prev,
                      content_position: e.target.value
                    }))}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Você pode modificar o minut ou deixar o atual
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo
                  </label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion(prev => ({
                      ...prev,
                      type: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="DUVIDA">Dúvida</option>
                    <option value="COMENTARIO">Comentário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {newQuestion.type === 'DUVIDA' ? 'Sua dúvida' : 'Seu comentário'}
                  </label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({
                      ...prev,
                      question: e.target.value
                    }))}
                    placeholder={newQuestion.type === 'DUVIDA' ? 'Digite sua dúvida...' : 'Digite seu comentário...'}
                    className="w-full p-2 border rounded-md min-h-[80px] resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newQuestion.private}
                    onChange={(e) => setNewQuestion(prev => ({
                      ...prev,
                      private: e.target.checked
                    }))}
                  />
                  <label htmlFor="private" className="text-sm">
                    Dúvida privada
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Enviar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {console.log('QUESTIONS DEBUG:', questions)}
          <div className="space-y-4">
            {loadingQuestions ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma dúvida ainda.</p>
                <p className="text-sm">Seja o primeiro a fazer uma pergunta!</p>
              </div>
            ) : (
              questions.map((question) => (
                <div key={question.id} className="p-4 border rounded-lg bg-background">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-2 py-1 rounded">
                      {question.content_position || '---'}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${question.type === 'DUVIDA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}> 
                      {question.type === 'DUVIDA' ? 'Dúvida' : 'Comentário'}
                    </span>
                    {question.private && (
                      <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                        Privado
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="block text-base font-medium text-gray-900">{question.question?.trim() ? question.question : 'Sem texto'}</span>
                  </div>
                  
                  {question.answer && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                          Resposta
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{question.answer}</p>
                      {question.answeredAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Respondido em {new Date(question.answeredAt).toLocaleDateString('pt-BR')} às {new Date(question.answeredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {question.createdAt
                      ? `${new Date(question.createdAt).toLocaleDateString('pt-BR')} às ${new Date(question.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                      : 'Data não disponível'}
                  </p>
                  
                  {!question.answer && (
                    <button
                      className="mt-2 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      onClick={() => window.location.href = `/duvidas/responder/${question.id}`}
                    >
                      Responder
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
