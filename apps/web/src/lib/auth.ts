import type {
  AuthMessageResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResendVerificationPayload,
  VerifyEmailPayload,
} from '@unis-plus/shared'

import { apiRequest } from './api-client'

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<AuthMessageResponse>('/auth/register', {
      method: 'POST',
      body: payload,
    }),

  login: (payload: LoginPayload) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    }),

  verifyEmail: (payload: VerifyEmailPayload) =>
    apiRequest<AuthMessageResponse>('/auth/verify-email', {
      method: 'POST',
      body: payload,
    }),

  resendVerification: (payload: ResendVerificationPayload) =>
    apiRequest<AuthMessageResponse>('/auth/resend-verification', {
      method: 'POST',
      body: payload,
    }),
}
