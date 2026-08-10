import { useState } from 'react'
import { Link } from 'react-router'
import { useApp } from '../../context/AppContext'
import Reveal from './Reveal'

export default function Footer() {
  const { settings } = useApp()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <footer style={{ backgroundColor: 'var(--card-dark)', color: '#fff' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <Reveal dir="up" delay={0}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '0.01em' }}>Mahfouz Adedimeji</span>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: '240px' }}>
              {settings.bio || 'Professor of Pragmatics and Applied Linguistics at the University of Ilorin, Nigeria. Fulbright Scholar.'}
            </p>
            {settings.email && (
              <a href={`mailto:${settings.email}`} style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--orange)', textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                {settings.email}
              </a>
            )}
          </Reveal>

          {/* Quick links */}
          <Reveal dir="up" delay={0.1}>
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['/', 'Home'], ['/biography', 'Biography'], ['/publications', 'Publications'], ['/blog', 'Essays'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'rgba(255,255,255,0.42)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)')}>
                  {label}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Categories */}
          <Reveal dir="up" delay={0.18}>
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>Essay Categories</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Edupeace', 'Books Review', 'The Alma Mater', 'Renaissance', 'Give & Take', 'Islam'].map(cat => (
                <Link key={cat} to="/blog" style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'rgba(255,255,255,0.42)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)')}>
                  {cat}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Newsletter */}
          <Reveal dir="up" delay={0.26}>
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}>Stay Updated</p>
            <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: '1rem' }}>
              New essays and publications, delivered when they are ready — no noise.
            </p>
            {sent ? (
              <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 600 }}>✓ You are subscribed.</p>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input type="email" required placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ fontFamily: 'Inter', fontSize: '0.78rem', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', outline: 'none', width: '100%' }} />
                <button type="submit" className="btn-orange" style={{ border: 'none', cursor: 'pointer', justifyContent: 'center', fontSize: '0.78rem', padding: '0.65rem 1rem' }}>
                  Subscribe
                </button>
              </form>
            )}
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Prof. Mahfouz A. Adedimeji · {settings.institution || 'University of Ilorin, Nigeria'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {settings.researchgate && (
              <a href={settings.researchgate} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}>
                ResearchGate
              </a>
            )}
            {settings.googleScholar && (
              <a href={settings.googleScholar} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}>
                Google Scholar
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}>
                LinkedIn
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}>
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
