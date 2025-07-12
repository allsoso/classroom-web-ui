import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarVideos } from '../../api/aulas/listar'

export default function ListarAula() {
  const [aulas, setAulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        setLoading(true)
        const data = await listarVideos()
        setAulas(data)
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar aulas:', err)
        setError('Erro ao carregar as aulas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchAulas()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listar Aulas</h1>
          <p className="text-muted-foreground">
            Carregando aulas disponíveis...
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listar Aulas</h1>
          <p className="text-muted-foreground">
            Erro ao carregar as aulas
          </p>
        </div>
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Listar Aulas</h1>
        <p className="text-muted-foreground">
          Todas as aulas disponíveis na plataforma
        </p>
      </div>

      {aulas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma aula encontrada.</p>
          <Link 
            to="/aulas/criar" 
            className="mt-4 inline-block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Criar primeira aula
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {aulas.map((aula) => (
            <div key={aula.id} className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{aula.title || 'Aula sem título'}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {aula.content}
                  </p>
                  
                  {aula.classrooms && aula.classrooms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-muted-foreground">Turmas:</span>
                      {aula.classrooms.map((turma) => (
                        <span 
                          key={turma.id} 
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {turma.codigo}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {aula.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Criada em: {new Date(aula.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {aula.type}
                  </span>
                  
                  <Link
                    to={`/aula/${aula.id}`}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Assistir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 