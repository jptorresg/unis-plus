import type { ReactNode } from 'react'
import '@/styles/globals.css'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  // TODO: agregar guard de autenticación aquí en pasos futuros
  // Por ahora asume que el usuario está autenticado
  return <>{children}</>
}
