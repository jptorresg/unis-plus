import type { ForumType } from '../types/forum.types'

// Describe el comportamiento de membresía por tipo de foro
export const FORUM_MEMBERSHIP_BEHAVIOR: Record<ForumType, string> = {
  GENERAL: 'Acceso automático para todos los usuarios',
  PUBLIC: 'Acceso inmediato al unirse',
  PRIVATE: 'Requiere solicitud y aprobación del administrador',
  RESTRICTED: 'Requiere categoría institucional permitida',
} as const

export const COMMENT_MAX_VISUAL_DEPTH = 3 // depth > 3 → "ver más respuestas"
