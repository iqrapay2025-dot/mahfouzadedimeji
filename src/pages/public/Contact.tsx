import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { submitContactMessage } from '../../../utils/supabase/dataService'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Reveal from '../../components/public/Reveal'
import portraitImg from '../../imports/1740246463274.jpeg'

const HERO_IMG = 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1600&h=600&fit=crop&auto=format'

// Client-side validation helpers (server-side also enforced via DB triggers)
const validate = (form: { name: string; email: string; subject: string; message: string }) => {
  const errors: Record<string, string> = {}
  const trimmed = {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
  }
  if (trimmed.name.length < 2) errors.name = 'Name must be at least 2 characters.'
  if (trimmed.name.length > 100) errors.name = 'Name must be 100 characters or less.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed.email)) errors.email = 'Please enter a valid email address.'
  if (trimmed.subject.length < 3) errors.subject = 'Subject must be at least 3 characters.'
  if (trimmed.subject.length > 200) errors.subject = 'Subject must be 200 characters or less.'
  if (trimmed.message.length < 10) errors.message = 'Message must be at least 10 characters.'
  if (trimmed.message.length > 5000) errors.message = 'Message must be 5000 characters or less.'
  return { errors, trimmed }
}

function RevealLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={visible ? 'reveal-left-visible' : 'reveal-left-hidden'}
      style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

function RevealRight({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={visible ? 'reveal-right-visible' : 'reveal-right-hidden'}
      style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

export default function Contact() {
  const { settings } = useApp()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    const { errors: validationErrors, trimmed } = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await submitContactMessage(trimmed)
      setSent(true)
    } catch (err) {
      const message = (err as Error)?.message ?? ''
      // Handle rate limit and validation errors from the server
      if (message.includes('Too many messages')) {
        setError('You have reached the message limit. Please try again later.')
      } else if (message) {
        setError(message.replace(/^.*exception:\s*/i, ''))
      } else {
        setError('Failed to send message. Please try again.')
      }
      console.error('Failed to send message:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter', fontSize: '0.875rem', padding: '0.75rem 1rem',
    border: '1.5px solid rgba(0,0,0,0.1)', backgroundColor: '#fff', color: '#111',
    outline: 'none', transition: 'border-color 0.2s', borderRadius: '12px', boxSizing: 'border-box',
  }

  const lbl: React.CSSProperties = {
    fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '0.5rem',
  }

  const socialLinks = [
    { label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { label: 'Institution', value: settings.institution, href: undefined },
    { label: 'ResearchGate', value: 'researchgate.net/profile/Mahfouz-Adedimeji', href: settings.researchgate },
    { label: 'Google Scholar', value: 'Google Scholar Profile', href: settings.googleScholar },
    { label: 'LinkedIn', value: 'LinkedIn Profile', href: settings.linkedin },
    { label: 'Facebook', value: 'Facebook Profile', href: settings.facebook },
    { label: 'Twitter/X', value: settings.twitter, href: undefined },
    { label: 'Academia.edu', value: settings.academia, href: undefined },
  ]

  return (
    <div style={{ backgroundColor: '#fff', overflowX: 'hidden' }}>
      {/* Hero */}
      <div style={{ position: 'relative', backgroundColor: '#0f0f0f', padding: '5.5rem 0 4rem', overflow: 'hidden' }}>
        <img src={HERO_IMG} alt="Fountain pen — academic correspondence"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.22 }} />
        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInUp 0.7s ease both' }} className="page-inner-lg">
          <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.75rem' }}>Get in Touch</p>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#fff', lineHeight: 0.9, marginBottom: '1rem' }}>CONTACT</h1>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, maxWidth: '480px' }}>
            Academic correspondence, media enquiries, and speaking invitations welcome.
          </p>
        </div>
      </div>

      <div className="page-inner-md grid-sidebar" style={{ padding: '4rem 1.5rem 5rem' }}>
        {/* Info panel */}
        <RevealLeft>
          {/* Portrait card */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', position: 'relative', aspectRatio: '3/4', backgroundColor: '#eee' }}>
            <img src={portraitImg} alt="Prof. Mahfouz Adedimeji"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
              <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Prof. M. A. Adedimeji</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>University of Ilorin, Nigeria</p>
            </div>
          </div>

          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.25rem', color: '#111', marginBottom: '1.5rem' }}>INFORMATION</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {socialLinks.map(({ label, value, href }) => value ? (
              <div key={label}>
                <p style={{ fontFamily: 'Inter', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
                {href ? (
                  <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                    style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#111', wordBreak: 'break-all', textDecoration: 'none', fontWeight: 600, borderBottom: '1.5px solid rgba(244,120,32,0.3)', paddingBottom: '1px', transition: 'border-color 0.2s, color 0.2s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--orange)'; el.style.borderColor = 'var(--orange)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#111'; el.style.borderColor = 'rgba(244,120,32,0.3)' }}>
                    {value}
                  </a>
                ) : (
                  <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#666', lineHeight: 1.5 }}>{value}</p>
                )}
              </div>
            ) : null)}
          </div>
          <div style={{ marginTop: '2rem', backgroundColor: 'var(--background-2)', padding: '1.25rem', borderRadius: '14px', borderLeft: '3px solid var(--orange)' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#666', lineHeight: 1.75 }}>
              Prof. Adedimeji welcomes correspondence on academic matters, media enquiries, and speaking invitations. He aims to reply within two working weeks.
            </p>
          </div>
        </RevealLeft>

        {/* Form */}
        <RevealRight>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.5rem', color: '#111', marginBottom: '2rem' }}>SEND A MESSAGE</h2>

          {sent ? (
            <div style={{ backgroundColor: 'var(--background-2)', padding: '3rem', textAlign: 'center', borderRadius: '20px', borderTop: '3px solid var(--orange)', animation: 'scaleIn 0.4s ease both' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.5rem', color: '#fff' }}>✓</span>
              </div>
              <p style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.5rem' }}>MESSAGE SENT</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                Thank you for reaching out. A reply will follow when possible.
              </p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-dark">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              )}
              <div className="grid-form-2col">
                <div>
                  <label style={lbl}>Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp}
                    onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                  {errors.name && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.name}</p>}
                </div>
                <div>
                  <label style={lbl}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp}
                    onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                  {errors.email && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.email}</p>}
                </div>
              </div>
              <div>
                <label style={lbl}>Subject *</label>
                <input required type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inp}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                {errors.subject && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.subject}</p>}
              </div>
              <div>
                <label style={lbl}>Message *</label>
                <textarea required rows={7} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                {errors.message && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.message}</p>}
              </div>
              <div>
                <button type="submit" disabled={submitting} className="btn-orange" style={{ border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending…' : 'Send Message →'}
                </button>
              </div>
            </form>
          )}
        </RevealRight>
      </div>
    </div>
  )
}
