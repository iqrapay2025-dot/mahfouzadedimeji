import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import type { Settings as SettingsType } from '../../context/AppContext'

const defaults: SettingsType = {
  bio: '', email: '', phone: '', institution: '',
  twitter: '', linkedin: '', researchgate: '', academia: '', facebook: '', googleScholar: '',
}

export default function Settings() {
  const { settings, updateSettings } = useApp()
  const [form, setForm] = useState<SettingsType>(defaults)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm({ ...settings })
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    // Client-side validation
    const nextErrors: Record<string, string> = {}
    if (form.bio && form.bio.length > 1000) nextErrors.bio = 'Bio must be 1000 characters or less.'
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.'
    const maxUrl = (v?: string) => v && v.length > 400
    if (maxUrl(form.linkedin)) nextErrors.linkedin = 'LinkedIn URL too long.'
    if (maxUrl(form.researchgate)) nextErrors.researchgate = 'ResearchGate URL too long.'
    if (maxUrl(form.academia)) nextErrors.academia = 'Academia.edu URL too long.'
    if (maxUrl(form.facebook)) nextErrors.facebook = 'Facebook URL too long.'
    if (maxUrl(form.googleScholar)) nextErrors.googleScholar = 'Google Scholar URL too long.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) { setSaving(false); return }
    try {
      await updateSettings(form)
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaving(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter', fontSize: '0.875rem', padding: '0.75rem 1rem',
    border: '1.5px solid rgba(0,0,0,0.1)', color: '#111', outline: 'none',
    backgroundColor: '#fafafa', transition: 'border-color 0.2s', borderRadius: '12px', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '0.45rem' }

  const Field = ({ label, name, type = 'text', hint }: { label: string; name: keyof SettingsType; type?: string; hint?: string }) => (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} value={form[name] as string} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={inp}
        onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
      {errors[name] && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors[name]}</p>}
      {hint && <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#ccc', marginTop: '0.35rem' }}>{hint}</p>}
    </div>
  )

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ backgroundColor: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.07)', borderTop: '3px solid var(--orange)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontFamily: 'Inter', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
    </div>
  )

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.35rem' }}>Configuration</p>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1, marginBottom: '0.5rem' }}>Settings</h1>
        <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#bbb' }}>Changes take effect immediately on the public site.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Section title="Biography">
          <div>
            <label style={lbl}>Short Bio <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#ccc' }}>(footer and meta)</span></label>
            <textarea rows={5} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
            <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#ccc', marginTop: '0.35rem' }}>Aim for 2–4 sentences covering your role, institution, and key research areas.</p>
          </div>
        </Section>

        <Section title="Contact Information">
          <Field label="Email Address" name="email" type="email" />
          <Field label="Phone Number" name="phone" hint="Optional — shown only if you choose to display it." />
          <Field label="Institution / Affiliation" name="institution" />
        </Section>

        <Section title="Social & Academic Profiles">
          <Field label="Twitter / X Handle" name="twitter" hint="e.g. @mahfouzade" />
          <Field label="LinkedIn URL" name="linkedin" hint="e.g. linkedin.com/in/mahfouz-adedimeji" />
          <Field label="ResearchGate URL" name="researchgate" hint="e.g. researchgate.net/profile/Mahfouz-Adedimeji" />
          <Field label="Academia.edu URL" name="academia" hint="e.g. unilorin.academia.edu/MahfouzAdedimeji" />
          <Field label="Facebook URL" name="facebook" hint="e.g. facebook.com/mahfouz.adedimeji" />
          <Field label="Google Scholar URL" name="googleScholar" hint="e.g. scholar.google.com/citations?user=..." />
        </Section>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button type="submit" disabled={saving} className="btn-orange"
            style={{ border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: '#047857' }}>
              ✓ Saved — changes are live.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
