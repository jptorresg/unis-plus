import type { InstitutionalCategory } from './user.types'

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  institutionalId: string
  category: InstitutionalCategory
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface AuthMessageResponse {
  message: string
}
