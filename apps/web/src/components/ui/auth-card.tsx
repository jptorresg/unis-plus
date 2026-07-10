import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div className="auth-card__logo" aria-label="UNIS+">
          <span className="auth-card__logo-mark">U+</span>
        </div>
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      </div>
      <div className="auth-card__body">{children}</div>
    </div>
  )
}
