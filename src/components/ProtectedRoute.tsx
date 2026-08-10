import { Navigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking access…</div>
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
