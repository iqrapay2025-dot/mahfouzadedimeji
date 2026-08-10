import { useState } from 'react'
import { Link } from 'react-router'
import { useApp } from '../../context/AppContext'

export default function PostsList() {
  const { posts, deletePost } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const filtered = posts
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const postToDelete = posts.find(p => p.id === deleteId)

  const filterBtn = (key: typeof statusFilter, label: string) => (
    <button key={key} onClick={() => { setStatusFilter(key); setPage(1) }}
      style={{ fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, padding: '0.5rem 1.1rem', borderRadius: '100px', border: '1.5px solid', borderColor: statusFilter === key ? 'var(--orange)' : 'rgba(0,0,0,0.1)', backgroundColor: statusFilter === key ? 'var(--orange)' : 'transparent', color: statusFilter === key ? '#fff' : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
      {label}
    </button>
  )

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.35rem' }}>Content</p>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1 }}>Essays</h1>
        </div>
        <Link to="/admin/posts/new" className="btn-orange" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          + New Essay
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input type="text" placeholder="Search essays…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ flex: '1 1 200px', fontFamily: 'Inter', fontSize: '0.82rem', padding: '0.55rem 1.1rem', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '100px', outline: 'none', backgroundColor: '#fff', color: '#111', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filterBtn('all', `All (${posts.length})`)}
          {filterBtn('published', `Published (${posts.filter(p => p.status === 'published').length})`)}
          {filterBtn('draft', `Drafts (${posts.filter(p => p.status === 'draft').length})`)}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Title', 'Category', 'Status', 'Date', ''].map(col => (
                  <th key={col} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 700, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', fontFamily: 'Inter', fontSize: '0.85rem', color: '#ccc' }}>
                    {posts.length === 0 ? 'No essays yet. Create your first one.' : 'No essays match your search.'}
                  </td>
                </tr>
              ) : paginated.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#fafafa')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '')}>
                  <td style={{ padding: '1rem 1.25rem', maxWidth: '320px' }}>
                    <Link to={`/admin/posts/${post.id}`}
                      style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 600, color: '#111', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </Link>
                    <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#ccc', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</p>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'Inter', fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>{post.category}</td>
                  <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: '0.62rem', fontWeight: 700, padding: '0.25rem 0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '100px', backgroundColor: post.status === 'published' ? 'rgba(4,120,87,0.08)' : 'rgba(0,0,0,0.05)', color: post.status === 'published' ? '#047857' : '#aaa' }}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'Inter', fontSize: '0.75rem', color: '#bbb', whiteSpace: 'nowrap' }}>
                    {new Date(post.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/posts/${post.id}`}
                        style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: 'var(--orange)', textDecoration: 'none', padding: '0.3rem 0.75rem', borderRadius: '100px', border: '1.5px solid var(--orange)', transition: 'all 0.15s' }}>
                        Edit
                      </Link>
                      <button onClick={() => setDeleteId(post.id)}
                        style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: '#ccc', background: 'transparent', borderRadius: '100px', border: '1.5px solid rgba(0,0,0,0.1)', padding: '0.3rem 0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.borderColor = '#ef4444' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#ccc'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 700, width: '34px', height: '34px', borderRadius: '10px', border: '1.5px solid', borderColor: page === i + 1 ? 'var(--orange)' : 'rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: page === i + 1 ? 'var(--orange)' : '#fff', color: page === i + 1 ? '#fff' : '#888', transition: 'all 0.15s' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderTop: '3px solid #ef4444' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.75rem' }}>Delete Essay?</h3>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '2rem', lineHeight: 1.7 }}>
              Are you sure? "<strong style={{ color: '#111' }}>{postToDelete?.title ?? ''}</strong>" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', border: '1.5px solid rgba(0,0,0,0.1)' }}>Cancel</button>
              <button onClick={async () => { setDeleting(true); await deletePost(deleteId); setDeleting(false); setDeleteId(null) }}
                disabled={deleting}
                style={{ flex: 1, fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 700, padding: '0.75rem', borderRadius: '100px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
