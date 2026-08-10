import { Link } from 'react-router'
import type { Post } from '../../context/AppContext'

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  'Edupeace':      { color: '#F47820', bg: 'rgba(244,120,32,0.09)' },
  'Books Review':  { color: '#047857', bg: 'rgba(4,120,87,0.09)' },
  'The Alma Mater':{ color: '#2563EB', bg: 'rgba(37,99,235,0.09)' },
  'Renaissance':   { color: '#B45309', bg: 'rgba(180,83,9,0.09)' },
  'Give & Take':   { color: '#7C3AED', bg: 'rgba(124,58,237,0.09)' },
  'Islam':         { color: '#0891B2', bg: 'rgba(8,145,178,0.09)' },
}

export default function PostCard({ post, list = false }: { post: Post; list?: boolean }) {
  const dateStr = new Date(post.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const cat = CAT_COLORS[post.category] ?? { color: '#888', bg: 'rgba(0,0,0,0.06)' }
  const fallback = `https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=600&h=400&fit=crop&auto=format`

  if (list) {
    return (
      <Link to={`/blog/${post.slug}`} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
        <img src={post.featuredImage || fallback} alt={post.title}
          style={{ width: '72px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'Inter', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cat.color }}>{post.category}</span>
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.85rem', color: 'var(--foreground)', lineHeight: 1.35, marginTop: '0.2rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.title}</p>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#bbb', marginTop: '0.3rem' }}>{dateStr}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
      <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
        <img src={post.featuredImage || fallback} alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }} />
      </div>
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cat.color, backgroundColor: cat.bg, padding: '0.2rem 0.6rem', borderRadius: '100px', display: 'inline-block', alignSelf: 'flex-start' }}>
          {post.category}
        </span>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.95rem', color: 'var(--foreground)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {post.title}
        </h3>
        <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#999', lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#bbb' }}>{dateStr}</span>
          <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: 'var(--orange)' }}>Read →</span>
        </div>
      </div>
    </Link>
  )
}
