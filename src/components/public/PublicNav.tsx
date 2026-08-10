import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/biography', label: 'About' },
  { to: '/blog', label: 'Essays' },
  { to: '/publications', label: 'Publications' },
]

export default function PublicNav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const textColor = '#1A1A1A'
  const mutedColor = '#888'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s',
      }}>
        {/* Main bar */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', width: '100%', gap: '2rem' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '0.95rem', color: textColor, letterSpacing: '0.01em', transition: 'color 0.3s' }}>Mahfouz Adedimeji</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
              {links.map(l => (
                <Link key={l.to} to={l.to} style={{
                  fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 500,
                  color: pathname === l.to ? 'var(--orange)' : mutedColor,
                  textDecoration: 'none', transition: 'color 0.2s',
                }}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link to="/contact" className="btn-orange hide-mobile" style={{ fontSize: '0.78rem', padding: '0.5rem 1.25rem' }}>
              Get in Touch
            </Link>

            {/* Mobile hamburger */}
            <div className="show-mobile" style={{ marginLeft: 'auto', display: 'none', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/contact" className="btn-orange" style={{ fontSize: '0.72rem', padding: '0.45rem 1rem' }}>
                Contact
              </Link>
              <button
                onClick={() => setOpen(o => !o)}
                aria-label="Toggle menu"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px', display: 'flex', flexDirection: 'column',
                  gap: '5px', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: textColor, borderRadius: '2px', transition: 'all 0.3s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
                <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: textColor, borderRadius: '2px', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
                <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: textColor, borderRadius: '2px', transition: 'all 0.3s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div style={{
          backgroundColor: '#fff',
          overflow: 'hidden',
          maxHeight: open ? '280px' : '0',
          transition: 'max-height 0.35s ease',
          borderTop: open ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{ padding: '1rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                fontFamily: 'Inter', fontSize: '0.95rem', fontWeight: pathname === l.to ? 700 : 500,
                color: pathname === l.to ? 'var(--orange)' : '#1A1A1A',
                textDecoration: 'none', padding: '0.75rem 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div style={{ height: '60px' }} />
    </>
  )
}
