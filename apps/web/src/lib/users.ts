import type {
  UpdateProfilePayload,
  UploadImageResponse,
  UserProfileResponse,
} from '@unis-plus/shared'
import { apiRequest } from './api-client'

function getToken(): string {
  // Temporal hasta implementar cookies httpOnly en el paso siguiente
  return sessionStorage.getItem('accessToken') ?? ''
}

export const usersApi = {
  getMe: () =>
    apiRequest<UserProfileResponse>('/users/me', {
      token: getToken(),
    }),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiRequest<UserProfileResponse>('/users/me', {
      method: 'PATCH',
      body: payload,
      token: getToken(),
    }),

  uploadAvatar: async (file: File): Promise<UploadImageResponse> => {
    const form = new FormData()
    form.append('file', file)
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'}/users/me/avatar`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
        // NO incluir Content-Type — el navegador lo pone solo con el boundary correcto
      },
    )
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error((err as { message?: string } | null)?.message ?? 'Error al subir imagen')
    }
    return response.json() as Promise<UploadImageResponse>
  },

  uploadBanner: async (file: File): Promise<UploadImageResponse> => {
    const form = new FormData()
    form.append('file', file)
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'}/users/me/banner`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      },
    )
    if (!response.ok) {
      const err = await response.json().catch(() => null)
      throw new Error((err as { message?: string } | null)?.message ?? 'Error al subir imagen')
    }
    return response.json() as Promise<UploadImageResponse>
  },
}
