import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClassroomStudents } from '../../api/turmas/listar_alunos';

const ListarAlunos = () => {
  const { id } = useParams();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClassroomStudents(id);
        setAlunos(data);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Erro ao carregar os alunos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAlunos();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Alunos da Turma
            </h1>
            <p className="text-muted-foreground">
              Visualize todos os alunos cadastrados nesta turma
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Carregando alunos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Alunos da Turma
            </h1>
            <p className="text-muted-foreground">
              Visualize todos os alunos cadastrados nesta turma
            </p>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Erro ao carregar alunos
            </h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Alunos da Turma
              </h1>
              <p className="text-muted-foreground">
                Visualize todos os alunos cadastrados nesta turma
              </p>
            </div>
            <Link
              to="/turma/listar"
              className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Voltar para Turmas
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Total de alunos: {alunos.length}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {aluno.nome || aluno.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {aluno.email}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {aluno.matricula && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    Matrícula: {aluno.matricula}
                  </div>
                )}
                
                {aluno.telefone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    {aluno.telefone}
                  </div>
                )}

                {aluno.dataIngresso && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    Ingresso: {new Date(aluno.dataIngresso).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {alunos.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum aluno encotrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Esta turma ainda nao possui alunos cadastrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarAlunos; 