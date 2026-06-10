// Espejo de los enums de Prisma — sin depender de @prisma/client en shared
export type UserRole = 'BASE' | 'SYSTEM_ADMIN' | 'INSTITUTIONAL_ADMIN'

export type InstitutionalCategory = 'STUDENT' | 'TEACHER' | 'STAFF' | 'ALUMNI'

export interface UserProfile {
  id: string
  institutionalId: string
  email: string
  firstName: string
  lastName: string
  description: string | null
  avatarUrl: string | null
  bannerUrl: string | null
  role: UserRole
  categories: InstitutionalCategory[]
  isActive: boolean
  createdAt: string // ISO string — Date no es serializable en JSON
}

// Para mostrar contenido de usuarios desactivados
export interface DeactivatedUserProfile {
  id: string
  displayName: 'usuario desactivado'
  avatarUrl: null
}

export type PublicUser = UserProfile | DeactivatedUserProfile

// Helper de tipo para narrowing en componentes
export function isDeactivatedUser(user: PublicUser): user is DeactivatedUserProfile {
  return 'displayName' in user
}
