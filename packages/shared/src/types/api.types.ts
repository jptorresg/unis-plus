// Wrapper estándar para todas las respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null // cursor-based pagination del draft
  hasMore: boolean
}

// Wrapper para respuestas simples
export interface ApiResponse<T> {
  data: T
}

// Para errores de validación de NestJS
export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}
