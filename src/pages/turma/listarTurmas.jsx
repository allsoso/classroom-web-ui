import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClassrooms } from '../../api/turmas/listar';

const ListarTurmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClassrooms();
        setTurmas(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar as turmas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurmas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Turmas
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas turmas e visualize informações dos alunos
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Carregando turmas...</span>
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
              Turmas
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas turmas e visualize informações dos alunos
            </p>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Erro ao carregar turmas
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Turmas
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas turmas e visualize informações dos alunos
          </p>
        </div>

        <div className="mb-6">
          <Link
            to="/turma/criar"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Criar Nova Turma
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {turmas.map((turma) => (
            <div
              key={turma.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {turma.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {turma.codigo}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Ativa
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {turma.descricao}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  {turma.alunos || 0} alunos
                </div>
                <div className="flex items-center">
                  {turma.aulas || 0} aulas
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/turma/${turma.id}/alunos`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  Ver Alunos
                </Link>
              </div>
            </div>
          ))}
        </div>

        {turmas.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira turma para organizar seus alunos
            </p>
            <Link
              to="/turma/criar"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Criar Primeira Turma
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarTurmas; 