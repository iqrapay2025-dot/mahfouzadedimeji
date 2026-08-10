import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { login, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  if (!loading && isAdmin) return <Navigate to="/admin/dashboard" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(false)
    try {
      const success = await login(email, password)
      if (success) navigate('/admin/dashboard')
      else { setError(true); setSubmitting(false) }
    } catch {
      setError(true); setSubmitting(false)
    }
  }
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    setTimeout(() => { setForgotSent(true); setSubmitting(false) }, 1000)
  }

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter', fontSize: '0.875rem',
    padding: '0.75rem 1rem', border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '12px', color: '#111', outline: 'none',
    backgroundColor: '#fafafa', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f7', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ width: '42%', backgroundColor: 'var(--orange)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '280px', height: '280px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', top: '8rem', left: '-5rem', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1rem', color: '#fff' }}>M</span>
            </div>
            <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '0.06em' }}>ADEDIMEJI</span>
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', lineHeight: 0.92, marginBottom: '1.25rem' }}>
            ADMIN<br />PORTAL
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
            Content management for Prof. Mahfouz A. Adedimeji — Fulbright Scholar, University of Ilorin.
          </p>
        </div>
      </div>

      {/* Right login */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {!forgotMode ? (
            <>
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2rem', color: '#111', marginBottom: '0.5rem' }}>Sign In</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#aaa', marginBottom: '2rem' }}>Enter your credentials to continue</p>

              {error && (
                <div style={{ backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#dc2626', margin: 0 }}>Invalid credentials. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: '#888', display: 'block', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@mahfouz.ng" style={inp}
                    onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: '#888', display: 'block', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} style={{ ...inp, paddingRight: '3rem' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.8rem', fontFamily: 'Inter', fontWeight: 600 }}>
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button type="button" onClick={() => { setForgotMode(true); setError(false) }}
                    style={{ background: 'none', border: 'none', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: 'var(--orange)', cursor: 'pointer', padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <button type="submit" disabled={submitting} className="btn-orange"
                  style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontSize: '0.9rem', padding: '0.8rem' }}>
                  {submitting ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            </>
          ) : forgotSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(212,80,40,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>✉</div>
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.5rem' }}>Check your email</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#777', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                If an account exists for that address, a reset link will arrive shortly.
              </p>
              <button onClick={() => { setForgotMode(false); setForgotSent(false) }}
                style={{ background: 'none', border: 'none', fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 600, color: 'var(--orange)', cursor: 'pointer' }}>
                ← Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2rem', color: '#111', marginBottom: '0.5rem' }}>Reset Password</h2>
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#aaa', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                Enter your email and we will send a reset link if an account exists.
              </p>
              <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="email" required placeholder="Your email address" style={inp}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                <button type="submit" disabled={submitting} className="btn-orange"
                  style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, padding: '0.8rem' }}>
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setForgotMode(false)}
                  style={{ background: 'none', border: 'none', fontFamily: 'Inter', fontSize: '0.82rem', color: '#bbb', cursor: 'pointer' }}>
                  ← Back to sign in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
