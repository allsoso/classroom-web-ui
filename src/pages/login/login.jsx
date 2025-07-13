import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { signin, signup, saveToken, saveUserData, getUserData, getToken } from '../../api/auth';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ALUNO'
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await signin(loginData);
      
      saveToken(response.access_token);
      
      // Se a API não retornar dados do usuário, extrair do token JWT
      let userData = response.user;
      if (!userData && response.access_token) {
        try {
          // Decodificar o token JWT para extrair dados do usuário
          const tokenPayload = JSON.parse(atob(response.access_token.split('.')[1]));
          
          userData = {
            id: tokenPayload.sub,
            email: tokenPayload.email,
            name: tokenPayload.name || 'Usuário',
            role: tokenPayload.role || 'ALUNO'
          };
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          userData = {
            id: 1,
            email: loginData.email,
            name: 'Usuário',
            role: 'ALUNO'
          };
        }
      }
      
      saveUserData(userData);
      
      // Aguardar um pouco para garantir que os dados sejam salvos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await signup(signupData);
      
      saveToken(response.access_token);
      
      // Se a API não retornar dados do usuário, extrair do token JWT
      let userData = response.user;
      if (!userData && response.access_token) {
        try {
          // Decodificar o token JWT para extrair dados do usuário
          const tokenPayload = JSON.parse(atob(response.access_token.split('.')[1]));
          
          userData = {
            id: tokenPayload.sub,
            email: tokenPayload.email,
            name: tokenPayload.name || signupData.name,
            role: tokenPayload.role || signupData.role
          };
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          userData = {
            id: 1,
            email: signupData.email,
            name: signupData.name,
            role: signupData.role
          };
        }
      }
      
      saveUserData(userData);
      
      // Aguardar um pouco para garantir que os dados sejam salvos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/');
    } catch (error) {
      console.error('Erro no signup:', error);
      setError(error.response?.data?.message || 'Erro ao criar conta. Verifique os dados informados.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isSignup ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignup 
                ? 'Preencha os dados para criar sua conta' 
                : 'Entre com suas credenciais'
              }
            </p>
          </div>

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Digite seu nome completo"
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={isSignup ? signupData.email : loginData.email}
                onChange={isSignup ? handleSignupChange : handleLoginChange}
                placeholder="Digite seu email"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={isSignup ? signupData.password : loginData.password}
                onChange={isSignup ? handleSignupChange : handleLoginChange}
                placeholder="Digite sua senha"
                className="w-full"
              />
            </div>

            {isSignup && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Usuário
                </label>
                <select
                  id="role"
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ALUNO">Aluno</option>
                  <option value="PROFESSOR">Professor</option>
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignup ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                isSignup ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                ou
              </span>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={toggleMode}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {isSignup 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Cadastre-se'
              }
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Classroom Web UI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
