import { Outlet } from 'react-router'
import AdminLayout from '../components/admin/AdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AdminRoot() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ProtectedRoute>
  )
}
