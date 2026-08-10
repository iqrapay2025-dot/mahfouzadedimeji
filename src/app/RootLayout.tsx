import { Outlet } from 'react-router'
import { AppProvider } from '../context/AppContext'
import { AuthProvider } from '../context/AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
