import type {
  UpdateProfilePayload,
  UploadImageResponse,
  UserProfileResponse,
} from '@unis-plus/shared'

import { apiRequest } from './api-client'

// Temporal — se reemplaza con SecureStore en el paso siguiente
let _accessToken = ''
export function setAccessToken(token: string) {
  _accessToken = token
}
function getToken() {
  return _accessToken
}

export const usersApi = {
  getMe: () => apiRequest<UserProfileResponse>('/users/me', { token: getToken() }),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiRequest<UserProfileResponse>('/users/me', {
      method: 'PATCH',
      body: payload,
      token: getToken(),
    }),

  uploadAvatar: async (
    uri: string,
    mimeType: string,
    fileName: string,
  ): Promise<UploadImageResponse> => {
    const form = new FormData()
    // React Native FormData acepta objetos con uri, type, name
    form.append('file', { uri, type: mimeType, name: fileName })

    const BASE_URL = 'http://10.0.2.2:3000' // ajustar según entorno
    const response = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    })
    if (!response.ok) {
      const err: unknown = await response.json().catch(() => null)
      throw new Error((err as { message?: string } | null)?.message ?? 'Error al subir imagen')
    }
    return response.json() as Promise<UploadImageResponse>
  },

  uploadBanner: async (
    uri: string,
    mimeType: string,
    fileName: string,
  ): Promise<UploadImageResponse> => {
    const form = new FormData()
    form.append('file', { uri, type: mimeType, name: fileName })

    const BASE_URL = 'http://10.0.2.2:3000'
    const response = await fetch(`${BASE_URL}/users/me/banner`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    })
    if (!response.ok) {
      const err: unknown = await response.json().catch(() => null)
      throw new Error((err as { message?: string } | null)?.message ?? 'Error al subir imagen')
    }
    return response.json() as Promise<UploadImageResponse>
  },
}
