import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router'
import { useApp } from '../../context/AppContext'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/posts', label: 'Essays', icon: '✎' },
  { to: '/admin/publications', label: 'Publications', icon: '≡' },
  { to: '/admin/media', label: 'Media Library', icon: '▣' },
  { to: '/admin/settings', label: 'Settings', icon: '◈' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, logout, sessionExpired, clearSessionExpiry } = useApp()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />

  if (sessionExpired) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212,80,40,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏱</span>
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.5rem' }}>Session Expired</h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '1.75rem', lineHeight: 1.7 }}>
            Your session has expired for security reasons. Please sign in again to continue.
          </p>
          <button onClick={() => { clearSessionExpiry(); logout() }} className="btn-orange" style={{ border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '60px' : '220px', flexShrink: 0,
        backgroundColor: '#fff', borderRight: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease', overflow: 'hidden',
        height: '100vh', position: 'sticky', top: 0,
        boxShadow: '2px 0 12px rgba(0,0,0,0.03)',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.65rem', justifyContent: collapsed ? 'center' : 'flex-start', minHeight: '64px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1rem', color: '#fff', lineHeight: 1 }}>M</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '0.9rem', color: '#111', margin: 0, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Admin Panel</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#aaa', margin: 0, whiteSpace: 'nowrap' }}>Prof. Adedimeji</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => {
            const active = pathname === item.to || pathname.startsWith(item.to + '/')
            return (
              <Link key={item.to} to={item.to} title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.7rem',
                  padding: collapsed ? '0.65rem' : '0.65rem 0.9rem',
                  borderRadius: '12px', justifyContent: collapsed ? 'center' : 'flex-start',
                  backgroundColor: active ? 'rgba(212,80,40,0.08)' : 'transparent',
                  color: active ? 'var(--orange)' : '#888',
                  fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: active ? 700 : 500,
                  textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.color = '#111' } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#888' } }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.75rem 0.6rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Link to="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: collapsed ? '0.55rem' : '0.55rem 0.9rem', borderRadius: '12px', color: '#bbb', fontFamily: 'Inter', fontSize: '0.8rem', textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'color 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#bbb')}>
            <span>↗</span>
            {!collapsed && 'Public Site'}
          </Link>
          <button onClick={() => logout()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: collapsed ? '0.55rem' : '0.55rem 0.9rem', borderRadius: '12px', width: '100%', backgroundColor: 'transparent', border: 'none', color: '#e55', fontFamily: 'Inter', fontSize: '0.8rem', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.07)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
            <span>⤴</span>
            {!collapsed && 'Log Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <button onClick={() => setCollapsed(v => !v)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '1.1rem', padding: '0.25rem', borderRadius: '8px', transition: 'color 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#bbb')}>
            ☰
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 600, color: '#111', margin: 0 }}>Prof. Adedimeji</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: 'var(--orange)', margin: 0 }}>Administrator</p>
            </div>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1rem', color: '#fff' }}>M</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f5f5f7' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
