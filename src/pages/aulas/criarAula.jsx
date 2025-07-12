import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { createVideo } from '@/api/aulas/criar'
import { getClassrooms } from '@/api/turmas/listar'

export default function CriarAula() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassrooms, setSelectedClassrooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingClassrooms, setLoadingClassrooms] = useState(true)

  // Carregar turmas disponíveis
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoadingClassrooms(true)
        const response = await getClassrooms()
        setClassrooms(response)
      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
        alert('Erro ao carregar turmas. Tente novamente.')
      } finally {
        setLoadingClassrooms(false)
      }
    }

    fetchClassrooms()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/mov']
      
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione um arquivo de vídeo válido (MP4, WebM, MOV).')
        e.target.value = ''
        return
      }
      
      const maxSize = 500 * 1024 * 1024 // 500MB
      if (file.size > maxSize) {
        alert('O arquivo é muito grande. Tamanho máximo permitido: 500MB')
        e.target.value = ''
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleClassroomToggle = (classroomId) => {
    setSelectedClassrooms(prev => {
      if (prev.includes(classroomId)) {
        return prev.filter(id => id !== classroomId)
      } else {
        return [...prev, classroomId]
      }
    })
  }



    const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo de vídeo.')
      return
    }

    if (selectedClassrooms.length === 0) {
      alert('Por favor, selecione pelo menos uma turma para receber o vídeo.')
      return
    }
    
    setLoading(true)
    
    try {
      let successCount = 0
      let errorCount = 0

      // Criar vídeo para cada turma selecionada
      for (const classroomId of selectedClassrooms) {
        try {
          const videoFormData = new FormData()
          videoFormData.append('title', formData.title)
          videoFormData.append('content', formData.content)
          videoFormData.append('classroom_id', Number(classroomId))
          videoFormData.append('videoFile', selectedFile)
          
          console.log(`Criando vídeo para turma ID: ${classroomId}`)
          console.log('Dados do FormData:', {
            title: formData.title,
            content: formData.content,
            classroom_id: Number(classroomId),
            classroom_id_type: typeof Number(classroomId),
            videoFile: selectedFile.name,
            videoFileSize: selectedFile.size
          })
          const response = await createVideo(videoFormData)
          console.log(`Vídeo criado para turma ${classroomId}:`, response)
          successCount++
        } catch (error) {
          console.error(`Erro ao criar vídeo para turma ${classroomId}:`, error)
          errorCount++
        }
      }

      // Mostrar resultado
      if (successCount > 0) {
        if (errorCount > 0) {
          alert(`Vídeo criado com sucesso para ${successCount} turma(s). ${errorCount} erro(s) ocorreram.`)
        } else {
          alert(`Vídeo criado com sucesso para ${successCount} turma(s)!`)
        }
        
        // Limpar formulário
        setFormData({ title: '', content: '' })
        setSelectedFile(null)
        setSelectedClassrooms([])
        
        // Limpar o input de arquivo
        const fileInput = document.getElementById('file')
        if (fileInput) {
          fileInput.value = ''
        }
      } else {
        alert('Erro ao criar vídeo para todas as turmas selecionadas.')
      }
      
    } catch (error) {
      console.error('Erro ao criar vídeo:', error)
      alert(`Erro ao criar vídeo: ${error.message || 'Tente novamente.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar Nova Aula</h1>
        <p className="text-muted-foreground">
          Adicione um novo vídeo às turmas selecionadas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Título do Vídeo *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Digite o título do vídeo"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="text-sm font-medium">
            Descrição do Vídeo *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Digite a descrição do vídeo"
            required
          />
        </div>
        
        <div>
          <label htmlFor="file" className="text-sm font-medium">
            Arquivo de Vídeo *
          </label>
          <Input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="w-full mt-1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Formatos aceitos: MP4, WebM, MOV. Tamanho máximo: 500MB
          </p>
          {selectedFile && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Arquivo selecionado: <strong>{selectedFile.name}</strong>
              </p>
              <p className="text-xs text-green-600">
                Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Selecionar Turmas *
          </label>
          {loadingClassrooms ? (
            <div className="mt-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-600">Carregando turmas...</p>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="mt-2 p-4 border rounded-md bg-yellow-50">
              <p className="text-sm text-yellow-800">
                Nenhuma turma encontrada. Crie uma turma primeiro.
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
              {classrooms.map((classroom) => (
                <label key={classroom.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedClassrooms.includes(classroom.id)}
                    onChange={() => handleClassroomToggle(classroom.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{classroom.nome}</p>
                    <p className="text-xs text-gray-500">Código: {classroom.codigo}</p>
                    {classroom.descricao && (
                      <p className="text-xs text-gray-500">{classroom.descricao}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
          {selectedClassrooms.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              {selectedClassrooms.length} turma(s) selecionada(s)
            </p>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || selectedClassrooms.length === 0}
            className="flex-1 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando Vídeo...' : 'Criar Vídeo'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({ title: '', content: '' })
              setSelectedFile(null)
              setSelectedClassrooms([])
              const fileInput = document.getElementById('file')
              if (fileInput) {
                fileInput.value = ''
              }
            }}
            className="px-4 py-3 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  )
} 