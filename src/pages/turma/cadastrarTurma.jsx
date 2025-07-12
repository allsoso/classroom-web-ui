import React, { useState } from 'react';
import { createClassroom } from '../../api/turmas/criar';

const CadastrarTurma = () => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const turmaCriada = await createClassroom(formData);
      console.log('Turma criada com sucesso:', turmaCriada);
      setMessage('Turma criada com sucesso!');
      setFormData({ nome: '', codigo: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      setMessage('Erro ao criar turma. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cadastrar Nova Turma
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para criar uma nova turma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="nome" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nome da Turma *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                placeholder="Digite o nome da turma"
              />
            </div>

            <div>
              <label 
                htmlFor="codigo" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Código da Turma *
              </label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                placeholder="Digite o código da turma"
              />
            </div>

            <div>
              <label 
                htmlFor="descricao" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                placeholder="Digite uma descrição para a turma (opcional)"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('sucesso') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Turma'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setFormData({ nome: '', codigo: '', descricao: '' });
                  setMessage('');
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastrarTurma; 