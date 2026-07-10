'use client'

import { useState } from 'react'

import { ApiError } from '@/lib/api-client'

export function useAuthForm<T extends object>() {
  const [fields, setFields] = useState<Partial<T>>({})
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function handleChange<K extends keyof T>(field: K, value: string) {
    setFields(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    setGlobalError(null)
  }

  function handleApiError(err: unknown) {
    if (err instanceof ApiError) {
      // NestJS devuelve message como string o string[]
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
    fieldErrors,
    globalError,
    successMessage,
    isLoading,
    setSuccessMessage,
    setGlobalError,
    handleChange,
    submit,
  }
}
