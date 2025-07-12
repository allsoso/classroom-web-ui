export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  requestTimeout: 10000,
  
  video: {
    streamingBaseUrl: import.meta.env.VITE_VIDEO_STREAMING_URL || 'http://localhost:3000',
    defaultFilenameFormat: 'video_{id}.mp4',
    supportedTypes: ['video/mp4', 'video/webm', 'video/mov'],
    maxFileSize: 500 * 1024 * 1024,
  }
} 