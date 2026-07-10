'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AuthCard } from '@/components/ui/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthForm } from '@/hooks/use-auth-form'
import { authApi } from '@/lib/auth'

type Category = 'STUDENT' | 'TEACHER' | 'STAFF' | 'ALUMNI'

const CATEGORY_LABELS: Record<Category, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  STAFF: 'Personal administrativo',
  ALUMNI: 'Alumni',
}

interface RegisterFields {
  firstName: string
  lastName: string
  email: string
  institutionalId: string
  category: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const form = useAuthForm<RegisterFields>()

  async function handleSubmit() {
    await form.submit(async () => {
      await authApi.register({
        firstName: form.fields.firstName ?? '',
        lastName: form.fields.lastName ?? '',
        email: form.fields.email ?? '',
        institutionalId: form.fields.institutionalId ?? '',
        category: (form.fields.category ?? 'STUDENT') as Category,
        password: form.fields.password ?? '',
      })
      // Redirigir a verificación con email pre-cargado
      router.push(`/verify-email?email=${encodeURIComponent(form.fields.email ?? '')}`)
    })
  }

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Únete a la comunidad UNIS+ con tu correo institucional"
    >
      {form.globalError && (
        <div className="alert alert--error" role="alert">
          {form.globalError}
        </div>
      )}

      <div className="form-row">
        <Input
          label="Nombre(s)"
          type="text"
          placeholder="María"
          value={form.fields.firstName ?? ''}
          onChange={e => {
            form.handleChange('firstName', e.target.value)
          }}
          autoComplete="given-name"
          required
        />
        <Input
          label="Apellidos"
          type="text"
          placeholder="García"
          value={form.fields.lastName ?? ''}
          onChange={e => {
            form.handleChange('lastName', e.target.value)
          }}
          autoComplete="family-name"
          required
        />
      </div>

      <Input
        label="Correo institucional"
        type="email"
        placeholder="maria.garcia@unis.edu.gt"
        value={form.fields.email ?? ''}
        onChange={e => {
          form.handleChange('email', e.target.value)
        }}
        autoComplete="email"
        hint="Solo se aceptan correos @unis.edu.gt"
        required
      />

      <Input
        label="ID institucional"
        type="text"
        placeholder="20230001"
        value={form.fields.institutionalId ?? ''}
        onChange={e => {
          form.handleChange('institutionalId', e.target.value)
        }}
        required
      />

      <div className="input-field">
        <label htmlFor="category" className="input-label">
          Categoría institucional
        </label>
        <select
          id="category"
          className="select-control"
          value={form.fields.category ?? ''}
          onChange={e => {
            form.handleChange('category', e.target.value)
          }}
          required
        >
          <option value="" disabled>
            Selecciona tu categoría
          </option>
          {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={form.fields.password ?? ''}
        onChange={e => {
          form.handleChange('password', e.target.value)
        }}
        autoComplete="new-password"
        hint="Mínimo 8 caracteres"
        required
      />

      <Button
        variant="primary"
        isLoading={form.isLoading}
        onClick={() => {
          void handleSubmit()
        }}
      >
        Crear cuenta
      </Button>

      <p className="auth-link">
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
      </p>
    </AuthCard>
  )
}
