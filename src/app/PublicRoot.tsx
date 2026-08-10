import { Outlet } from 'react-router'
import PublicNav from '../components/public/PublicNav'
import Footer from '../components/public/Footer'
import ScrollToTop from '../components/public/ScrollToTop'

export default function PublicRoot() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNav />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
