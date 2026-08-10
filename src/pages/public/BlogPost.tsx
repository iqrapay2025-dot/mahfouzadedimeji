import { useParams, Link, Navigate } from 'react-router'
import usePosts from '../../hooks/usePosts'
import CategoryTag from '../../components/public/CategoryTag'
import PostCard from '../../components/public/PostCard'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { posts, loading } = usePosts()
  const post = posts.find(p => p.slug === slug && p.status === 'published')

  // Wait for posts to load before deciding whether the essay exists.
  // Without this, the first render sees an empty posts array and
  // immediately redirects back to /blog — making "Read More" appear
  // to reload the list page instead of opening the essay.
  if (loading) {
    return (
      <div style={{ backgroundColor: '#fff', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#999' }}>Loading essay…</p>
        </div>
      </div>
    )
  }

  if (!post) return <Navigate to="/blog" replace />

  const dateStr = new Date(post.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const related = posts.filter(p => p.id !== post.id && p.category === post.category && p.status === 'published').slice(0, 3)

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--background-2)', padding: '3rem 0 2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem' }}>
          <Link to="/blog" style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: '#aaa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#aaa')}>
            ← Back to Essays
          </Link>
          <div style={{ marginBottom: '1rem' }}>
            <CategoryTag category={post.category as any} />
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#111', lineHeight: 1.0, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
            {post.title.toUpperCase()}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1rem', color: '#fff' }}>M</span>
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 600, color: '#111' }}>{post.author}</span>
            </div>
            <span style={{ color: '#ddd' }}>·</span>
            <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#aaa' }}>{dateStr}</span>
            <span style={{ color: '#ddd' }}>·</span>
            <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#aaa' }}>~18 min read</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.featuredImage && (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', marginTop: '2.5rem' }}>
            <img src={post.featuredImage} alt={post.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      )}

      {/* Body */}
      <article style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {post.excerpt && (
          <div style={{ borderLeft: '3px solid var(--orange)', paddingLeft: '1.5rem', marginBottom: '2.5rem', backgroundColor: 'var(--background-2)', padding: '1.5rem 1.5rem 1.5rem 2rem', borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '1rem', fontStyle: 'italic', color: '#444', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
              {post.excerpt}
            </p>
          </div>
        )}
        {/* Rich content from the admin TipTap editor — HTML is rendered with
            dangerouslySetInnerHTML because this content is authored only by the
            authenticated admin (a trusted source) and is additionally sanitized
            server-side by the sanitize_post_content DB trigger. */}
        <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <CategoryTag category={post.category as any} />
          <Link to="/blog" style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, color: '#aaa', textDecoration: 'none' }}>← All Essays</Link>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ backgroundColor: 'var(--background-2)', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '4rem 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2rem', color: '#111', marginBottom: '2rem' }}>MORE IN THIS CATEGORY</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {related.map(r => <PostCard key={r.id} post={r} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
