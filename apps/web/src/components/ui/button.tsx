import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className={isLoading ? 'btn__text--loading' : ''}>{children}</span>
    </button>
  )
}
