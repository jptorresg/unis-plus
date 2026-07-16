'use client'

import { useEffect, useRef, useState } from 'react'
import type { UserProfileResponse } from '@unis-plus/shared'
import { Button } from '@/components/ui/button'
import { usersApi } from '@/lib/users'

const CATEGORY_LABELS: Record<string, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  STAFF: 'Personal',
  ALUMNI: 'Alumni',
}

const MAX_DESCRIPTION = 300

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [description, setDescription] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [isSavingDesc, setIsSavingDesc] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void usersApi
      .getMe()
      .then(data => {
        setProfile(data)
        setDescription(data.description ?? '')
      })
      .catch(() => setError('No se pudo cargar el perfil.'))
  }, [])

  function getInitials(firstName: string, lastName: string) {
    return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
  }

  async function handleSaveDescription() {
    if (!profile) return
    setIsSavingDesc(true)
    setError(null)
    try {
      const updated = await usersApi.updateProfile({ description })
      setProfile(updated)
      setIsEditingDesc(false)
      setSuccessMsg('Descripción actualizada.')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch {
      setError('No se pudo guardar la descripción.')
    } finally {
      setIsSavingDesc(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingAvatar(true)
    setError(null)
    try {
      await usersApi.uploadAvatar(file)
      const updated = await usersApi.getMe()
      setProfile(updated)
      setSuccessMsg('Foto de perfil actualizada.')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir foto.')
    } finally {
      setIsUploadingAvatar(false)
      // Limpiar el input para permitir subir el mismo archivo de nuevo
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingBanner(true)
    setError(null)
    try {
      await usersApi.uploadBanner(file)
      const updated = await usersApi.getMe()
      setProfile(updated)
      setSuccessMsg('Banner actualizado.')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir banner.')
    } finally {
      setIsUploadingBanner(false)
      if (bannerInputRef.current) bannerInputRef.current.value = ''
    }
  }

  if (!profile) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--color-neutral-400)',
        }}
      >
        Cargando perfil…
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-banner">
        {profile.bannerUrl ? <img src={profile.bannerUrl} alt="Banner de perfil" /> : null}
        {isUploadingBanner && (
          <div className="upload-overlay">
            <div className="upload-overlay__spinner" />
          </div>
        )}
        <button
          className="profile-banner__edit"
          onClick={() => bannerInputRef.current?.click()}
          disabled={isUploadingBanner}
          aria-label="Cambiar banner"
        >
          {isUploadingBanner ? 'Subiendo…' : 'Cambiar banner'}
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={e => {
            void handleBannerChange(e)
          }}
        />
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-header__top">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar__placeholder">
                {getInitials(profile.firstName, profile.lastName)}
              </div>
            )}
            {isUploadingAvatar && (
              <div className="upload-overlay" style={{ borderRadius: '50%' }}>
                <div className="upload-overlay__spinner" />
              </div>
            )}
            <button
              className="profile-avatar__edit"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              aria-label="Cambiar foto de perfil"
            >
              {/* Ícono de cámara inline */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => {
                void handleAvatarChange(e)
              }}
            />
          </div>

          <div className="profile-header__info">
            <h1 className="profile-header__name">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="profile-header__meta">{profile.email}</p>
          </div>
        </div>

        {/* Badges de categoría */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {profile.categories.map(cat => (
            <span key={cat} className="profile-header__badge">
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          ))}
        </div>
      </div>

      {/* Mensajes globales */}
      {error && (
        <div className="profile-card">
          <div className="alert alert--error">{error}</div>
        </div>
      )}
      {successMsg && (
        <div className="profile-card">
          <div className="alert alert--success">{successMsg}</div>
        </div>
      )}

      {/* Sección: Descripción */}
      <div className="profile-card">
        <div className="profile-section">
          <p className="profile-section__title">Acerca de mí</p>
          {isEditingDesc ? (
            <>
              <textarea
                className="textarea-control"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
                placeholder="Cuéntanos algo sobre ti…"
                rows={4}
              />
              <p className="char-count">
                {description.length}/{MAX_DESCRIPTION}
              </p>
              <div className="save-bar">
                <Button
                  variant="ghost"
                  className="btn--sm"
                  onClick={() => {
                    setDescription(profile.description ?? '')
                    setIsEditingDesc(false)
                  }}
                  disabled={isSavingDesc}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="btn--sm"
                  isLoading={isSavingDesc}
                  onClick={() => {
                    void handleSaveDescription()
                  }}
                >
                  Guardar
                </Button>
              </div>
            </>
          ) : (
            <>
              <p
                style={{
                  fontSize: '15px',
                  color: profile.description
                    ? 'var(--color-neutral-950)'
                    : 'var(--color-neutral-400)',
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {profile.description ?? 'Aún no has agregado una descripción.'}
              </p>
              <Button variant="ghost" className="btn--sm" onClick={() => setIsEditingDesc(true)}>
                {profile.description ? 'Editar descripción' : 'Agregar descripción'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Sección: Información de cuenta */}
      <div className="profile-card">
        <div className="profile-section">
          <p className="profile-section__title">Información de cuenta</p>
          <div className="info-row">
            <span className="info-row__label">ID institucional</span>
            <span className="info-row__value">{profile.institutionalId}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Correo</span>
            <span className="info-row__value">{profile.email}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Rol</span>
            <span className="info-row__value">
              {profile.role === 'SYSTEM_ADMIN'
                ? 'Administrador del sistema'
                : profile.role === 'INSTITUTIONAL_ADMIN'
                  ? 'Administrador institucional'
                  : 'Usuario'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Miembro desde</span>
            <span className="info-row__value">
              {new Date(profile.createdAt).toLocaleDateString('es-GT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
