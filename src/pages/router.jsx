import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"
import DefaultLayout from "./layouts/defaultLyaout"
import LoginPage from "./login/login"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import AssistirAula from "./aulas/assistirAula"
import CriarAula from "./aulas/criarAula"
import ListarAula from "./aulas/listarAula"
import CadastrarTurma from "./turma/cadastrarTurma"
import ListarTurmas from "./turma/listarTurmas"
import ListarAlunos from "./turma/listarAlunos"
import ResponderDuvida from "./duvidas/responder"
import { isAuthenticated } from "../lib/auth"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="aula/:id" element={<AssistirAula />} />
          <Route path="aulas/listar" element={<ListarAula />} />
          <Route path="aulas/criar" element={<CriarAula />} />
          <Route path="turma/listar" element={<ListarTurmas />} />
          <Route path="turma/criar" element={<CadastrarTurma />} />
          <Route path="turma/:id/alunos" element={<ListarAlunos />} />
          <Route path="duvidas" element={<Duvidas />} />
          <Route path="duvidas/responder/:id" element={<ResponderDuvida />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo ao Classroom</h1>
        <p className="text-muted-foreground">
          Plataforma de aprendizado online
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">Aulas Disponíveis</h3>
          <p className="text-muted-foreground mb-4">Explore nossa biblioteca de aulas</p>
          <Link to="/aulas/listar" className="text-primary hover:underline">
            Ver aulas →
          </Link>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">Gerenciar Turmas</h3>
          <p className="text-muted-foreground mb-4">Visualize e gerencie suas turmas</p>
          <Link to="/turma/listar" className="text-primary hover:underline">
            Ver turmas →
          </Link>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">Criar Nova Aula</h3>
          <p className="text-muted-foreground mb-4">Adicione conteúdo à plataforma</p>
          <Link to="/aulas/criar" className="text-primary hover:underline">
            Criar aula →
          </Link>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">Dúvidas</h3>
          <p className="text-muted-foreground mb-4">Tire suas dúvidas</p>
          <Link to="/duvidas" className="text-primary hover:underline">
            Ver dúvidas →
          </Link>
        </div>
      </div>
    </div>
  )
}





function Duvidas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dúvidas</h1>
        <p className="text-muted-foreground">
          Tire suas dúvidas sobre o conteúdo
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Como funciona o React Router?</h3>
          <p className="text-muted-foreground mb-3">
            Gostaria de entender melhor como implementar rotas dinâmicas...
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Por: João Silva</span>
            <span>2 respostas</span>
            <span>há 1 hora</span>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Dúvida sobre Hooks</h3>
          <p className="text-muted-foreground mb-3">
            Quando devo usar useEffect vs useMemo?...
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Por: Maria Santos</span>
            <span>5 respostas</span>
            <span>há 3 horas</span>
          </div>
        </div>
        
        <button className="w-full px-4 py-3 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
          Nova Dúvida
        </button>
      </div>
    </div>
  )
}
