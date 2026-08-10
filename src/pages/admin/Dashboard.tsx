import { Link } from 'react-router'
import { useApp } from '../../context/AppContext'

function StatCard({ label, value, sub, color = 'var(--orange)' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: '0.75rem' }}>{label}</p>
      <p style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color, lineHeight: 1, marginBottom: '0.35rem' }}>{value}</p>
      {sub && <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#bbb' }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { posts, publications, settings, loading, error, postCount, publicationCount, recentPosts } = useApp()

  // Real counts come straight from the Supabase COUNT queries loaded by
  // AppContext. Fall back to the fetched array length only as a safety net.
  const totalEssays = postCount > 0 ? postCount : posts.length
  const totalPublications = publicationCount > 0 ? publicationCount : publications.length
  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  // Recent essays come from a real query ordered by created_at desc
  // (AppContext.fetchRecentPosts). Fall back to the in-memory array only if
  // the dedicated query is empty.
  const recent = recentPosts.length > 0
    ? recentPosts
    : [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 5)

  const quickActions = [
    { to: '/admin/posts/new', icon: '✎', label: 'New Essay', desc: 'Write a new essay or article' },
    { to: '/admin/publications', icon: '≡', label: 'Add Publication', desc: 'Log a new scholarly publication' },
    { to: '/admin/media', icon: '▣', label: 'Upload Media', desc: 'Add images to media library' },
    { to: '/admin/settings', icon: '◈', label: 'Settings', desc: 'Update site information' },
  ]

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.4rem' }}>Welcome back</p>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1 }}>Dashboard</h1>
      </div>

      {/* Visible error banner — a failed Supabase query is never silently "0" */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', margin: 0, lineHeight: 1.55 }}>⚠ {error}</p>
        </div>
      )}

      {/* Stats — driven by real Supabase COUNT queries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', backgroundColor: '#fff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#aaa' }}>Loading content from Supabase…</p>
          </div>
        ) : (
          <>
            <StatCard label="Total Essays" value={totalEssays} sub={`${published} published`} />
            <StatCard label="Published" value={published} sub="live on site" color="#047857" />
            <StatCard label="Drafts" value={drafts} sub="not yet live" color="#6d28d9" />
            <StatCard label="Publications" value={totalPublications} sub="scholarly works" color="#111" />
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Quick actions */}
        <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.1rem', color: '#111', marginBottom: '1.25rem' }}>QUICK ACTIONS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickActions.map(a => (
              <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1rem', borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(0,0,0,0.07)', transition: 'all 0.15s', backgroundColor: '#fff' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,80,40,0.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLElement).style.backgroundColor = '#fff' }}>
                <span style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(212,80,40,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--orange)', flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 700, color: '#111', margin: 0 }}>{a.label}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', margin: 0 }}>{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent essays — real query ordered by created_at desc */}
        <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>RECENT ESSAYS</h2>
            <Link to="/admin/posts" style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: 'var(--orange)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recent.map(post => (
              <Link key={post.id} to={`/admin/posts/${post.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.9rem', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 600, color: '#111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#bbb', margin: 0 }}>{post.publishDate || ''}</p>
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', padding: '0.2rem 0.6rem', borderRadius: '100px', marginLeft: '0.75rem', flexShrink: 0, backgroundColor: post.status === 'published' ? 'rgba(4,120,87,0.08)' : 'rgba(0,0,0,0.05)', color: post.status === 'published' ? '#047857' : '#aaa' }}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </Link>
            ))}
            {recent.length === 0 && !loading && (
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#ccc', textAlign: 'center', padding: '2rem 0' }}>No essays yet.</p>
            )}
            {recent.length === 0 && loading && (
              <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#ccc', textAlign: 'center', padding: '2rem 0' }}>Loading recent essays…</p>
            )}
          </div>
        </div>
      </div>

      {/* Site info */}
      <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', marginTop: '1.5rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: '0.3rem' }}>Site Title</p>
          <p style={{ fontFamily: 'Inter', fontSize: '0.88rem', fontWeight: 600, color: '#111' }}>Prof. Mahfouz Adedimeji</p>
        </div>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: '0.3rem' }}>Contact Email</p>
          <p style={{ fontFamily: 'Inter', fontSize: '0.88rem', fontWeight: 600, color: '#111' }}>{settings.email || '—'}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" target="_blank" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>View Public Site ↗</Link>
        </div>
      </div>
    </div>
  )
}