import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined

const BASE_URL = extra?.apiUrl ?? 'http://10.0.2.2:3000'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
}

interface ErrorResponseBody {
  message?: string | string[]
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody: ErrorResponseBody | null = await response
      .json()
      .then(data => data as ErrorResponseBody)
      .catch(() => null)

    const message =
      typeof errorBody?.message === 'string'
        ? errorBody.message
        : `Error ${String(response.status)}`

    throw new ApiError(response.status, message, errorBody)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
