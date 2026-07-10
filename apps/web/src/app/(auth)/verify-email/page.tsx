'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { AuthCard } from '@/components/ui/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthForm } from '@/hooks/use-auth-form'
import { authApi } from '@/lib/auth'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') ?? ''
  const form = useAuthForm<{ code: string }>()

  async function handleVerify() {
    await form.submit(async () => {
      await authApi.verifyEmail({
        email: emailFromUrl,
        code: form.fields.code ?? '',
      })
      form.setSuccessMessage('¡Correo verificado! Redirigiendo...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    })
  }

  async function handleResend() {
    await form.submit(async () => {
      const res = await authApi.resendVerification({ email: emailFromUrl })
      form.setSuccessMessage(res.message)
    })
  }

  return (
    <AuthCard
      title="Verifica tu correo"
      subtitle={`Enviamos un código de 6 dígitos a ${emailFromUrl || 'tu correo institucional'}`}
    >
      {form.globalError && (
        <div className="alert alert--error" role="alert">
          {form.globalError}
        </div>
      )}
      {form.successMessage && (
        <div className="alert alert--success" role="status">
          {form.successMessage}
        </div>
      )}

      <Input
        label="Código de verificación"
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        value={form.fields.code ?? ''}
        onChange={e => {
          form.handleChange('code', e.target.value)
        }}
        autoComplete="one-time-code"
        required
      />

      <Button
        variant="primary"
        isLoading={form.isLoading}
        onClick={() => {
          void handleVerify()
        }}
      >
        Verificar correo
      </Button>

      <div className="divider">o</div>

      <Button
        variant="ghost"
        isLoading={form.isLoading}
        onClick={() => {
          void handleResend()
        }}
      >
        Reenviar código
      </Button>

      <p className="auth-link">
        <Link href="/login">Volver al inicio de sesión</Link>
      </p>
    </AuthCard>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  )
}
