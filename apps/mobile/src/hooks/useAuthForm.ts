import { useState } from 'react'

import { ApiError } from '../lib/api-client'

export function useAuthForm<T extends object>() {
  const [fields, setFields] = useState<Partial<T>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(field: keyof T, value: string) {
    setFields(prev => ({ ...prev, [field]: value }))
    setGlobalError(null)
  }

  function handleApiError(err: unknown) {
    if (err instanceof ApiError) {
      const raw = (err.body as { message?: string | string[] } | null)?.message
      if (Array.isArray(raw)) {
        setGlobalError(raw.join('. '))
      } else {
        setGlobalError(raw ?? 'Ocurrió un error inesperado.')
      }
    } else {
      setGlobalError('No se pudo conectar con el servidor.')
    }
  }

  async function submit(fn: () => Promise<void>) {
    setIsLoading(true)
    setGlobalError(null)
    setSuccessMessage(null)
    try {
      await fn()
    } catch (err) {
      handleApiError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fields,
    globalError,
    successMessage,
    isLoading,
    setSuccessMessage,
    setGlobalError,
    handleChange,
    submit,
  }
}
