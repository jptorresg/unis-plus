import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="input-field">
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <input
        id={inputId}
        className={`input-control ${error ? 'input-control--error' : ''}`}
        {...props}
      />
      {hint && !error && <span className="input-hint">{hint}</span>}
      {error && (
        <span className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
