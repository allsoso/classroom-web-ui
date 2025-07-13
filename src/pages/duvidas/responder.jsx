import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { responderDuvida } from '../../api/duvidas/responder'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export default function ResponderDuvida() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await responderDuvida(id, answer)
      setSuccess(true)
      setTimeout(() => navigate(-1), 1500)
    } catch (err) {
      setError('Erro ao enviar resposta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Responder Dúvida</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sua resposta</label>
          <textarea
            className="w-full p-2 border rounded-md min-h-[100px] resize-none"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            required
            placeholder="Digite sua resposta aqui..."
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Resposta enviada com sucesso!</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !answer.trim()}>
            {loading ? 'Enviando...' : 'Enviar resposta'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
} 