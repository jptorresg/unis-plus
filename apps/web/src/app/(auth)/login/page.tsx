'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AuthCard } from '@/components/ui/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthForm } from '@/hooks/use-auth-form'
import { authApi } from '@/lib/auth'

interface LoginFields {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const form = useAuthForm<LoginFields>()

  async function handleSubmit() {
    const email = form.fields.email ?? ''
    const password = form.fields.password ?? ''

    await form.submit(async () => {
      const { accessToken, refreshToken } = await authApi.login({ email, password })
      // TODO Sprint 5 paso siguiente: persistir tokens en cookie httpOnly o zustand
      // Por ahora se almacena en sessionStorage solo para desarrollo
      sessionStorage.setItem('accessToken', accessToken)
      sessionStorage.setItem('refreshToken', refreshToken)
      router.push('/home')
    })
  }

  return (
    <AuthCard title="Bienvenido a UNIS+" subtitle="Inicia sesión con tu correo institucional">
      {form.globalError && (
        <div className="alert alert--error" role="alert">
          {form.globalError}
        </div>
      )}

      <Input
        label="Correo institucional"
        type="email"
        placeholder="tu.nombre@unis.edu.gt"
        value={form.fields.email ?? ''}
        onChange={e => {
          form.handleChange('email', e.target.value)
        }}
        autoComplete="email"
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={form.fields.password ?? ''}
        onChange={e => {
          form.handleChange('password', e.target.value)
        }}
        autoComplete="current-password"
        required
      />

      <div style={{ textAlign: 'right', marginTop: '-8px' }}>
        <Link
          href="/forgot-password"
          style={{
            fontSize: '13px',
            color: 'var(--color-primary-700)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        variant="primary"
        isLoading={form.isLoading}
        onClick={() => {
          void handleSubmit()
        }}
      >
        Iniciar sesión
      </Button>

      <p className="auth-link">
        ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
      </p>
    </AuthCard>
  )
}
