import type { ReactNode } from 'react'
import '@/styles/globals.css'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-layout">{children}</div>
}
