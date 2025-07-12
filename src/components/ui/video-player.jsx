import { useState } from 'react'

export function VideoPlayer({ 
  src, 
  title, 
  className = "", 
  onError, 
  onLoad,
  onTimeUpdate,
  showDebugInfo = false 
}) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e) => {
    setHasError(true)
    setIsLoading(false)
    console.error('Erro no player de vídeo:', e)
    if (onError) onError(e)
  }

  const handleLoad = () => {
    setHasError(false)
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleTimeUpdate = (e) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.target.currentTime)
    }
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    const videoElement = document.querySelector('video')
    if (videoElement) {
      videoElement.load()
    }
  }

  if (!src) {
    return (
      <div className={`aspect-video w-full bg-black rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-5xl mb-4">🎥</div>
          <p className="text-lg font-medium">Player de Vídeo</p>
          <p className="text-sm text-gray-400">{title || 'Sem vídeo'}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`aspect-video w-full bg-black rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-lg font-medium">Erro ao carregar o vídeo</p>
          <p className="text-sm text-gray-400 mb-4">Não foi possível reproduzir o vídeo</p>
          {showDebugInfo && (
            <div className="text-xs text-gray-500 space-y-1 mb-4">
              <p><strong>URL:</strong> {src}</p>
              <p><strong>Título:</strong> {title}</p>
              <p><strong>Status:</strong> Erro de carregamento</p>
            </div>
          )}
          <button 
            onClick={handleRetry}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`aspect-video w-full bg-black rounded-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      <video 
        controls 
        width="100%"
        className="w-full h-full rounded-lg"
        preload="metadata"
        onError={handleError}
        onLoadedMetadata={handleLoad}
        onCanPlay={handleLoad}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </div>
  )
} 