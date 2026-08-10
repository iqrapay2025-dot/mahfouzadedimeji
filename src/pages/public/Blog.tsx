import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import usePosts from '../../hooks/usePosts'
import PostCard from '../../components/public/PostCard'
import type { Category } from '../../context/AppContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Pen on lined paper — perfect for an essay archive
const HERO_IMG = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&h=600&fit=crop&auto=format'

const CATS: Category[] = ['Edupeace', 'Books Review', 'The Alma Mater', 'Renaissance', 'Give & Take', 'Islam']
const PER_PAGE = 9

function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '180px' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ height: '18px', width: '70px', borderRadius: '100px' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%' }} />
        <div className="skeleton" style={{ height: '14px', width: '75%' }} />
        <div className="skeleton" style={{ height: '12px', width: '40%', marginTop: '0.5rem' }} />
      </div>
    </div>
  )
}

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={visible ? 'reveal-visible' : 'reveal-hidden'}
      style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

export default function Blog() {
  const { posts, loading } = usePosts()
  const [searchParams, setSearchParams] = useSearchParams()
  const catParam = searchParams.get('category') as Category | null
  const [activeCategory, setActiveCategory] = useState<Category | null>(catParam)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [page, setPage] = useState(1)
  const [localLoading] = useState(false)

  const isInitialLoading = loading || localLoading

  const published = posts.filter(p => p.status === 'published')

  const filtered = useMemo(() => published
    .filter(p => !activeCategory || p.category === activeCategory)
    .filter(p => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate)),
    [published, activeCategory, search])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCat = (cat: Category | null) => {
    setActiveCategory(cat); setPage(1)
    if (cat) setSearchParams({ category: cat }); else setSearchParams({})
  }

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ position: 'relative', backgroundColor: '#0f0f0f', padding: '5.5rem 0 4rem', overflow: 'hidden' }}>
        <img src={HERO_IMG} alt="Pen on paper — essay writing"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ animation: 'fadeInUp 0.7s ease both' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.75rem' }}>Writing Archive</p>
            <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#fff', lineHeight: 0.95, marginBottom: '1.5rem' }}>
              ESSAYS &amp;<br />COMMENTARY
            </h1>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', animation: 'fadeInUp 0.7s 0.15s ease both' }}>
            <input type="text" placeholder="Search essays…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ flex: '1 1 220px', maxWidth: '320px', fontFamily: 'Inter', fontSize: '0.82rem', padding: '0.6rem 1.1rem', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.15)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
            <button onClick={() => handleCat(null)}
              style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, padding: '0.52rem 1.2rem', borderRadius: '100px', border: '1.5px solid', borderColor: !activeCategory ? 'var(--orange)' : 'rgba(255,255,255,0.2)', backgroundColor: !activeCategory ? 'var(--orange)' : 'transparent', color: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
              All
            </button>
            {CATS.map(cat => (
              <button key={cat} onClick={() => handleCat(activeCategory === cat ? null : cat)}
                style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, padding: '0.52rem 1.2rem', borderRadius: '100px', border: '1.5px solid', borderColor: activeCategory === cat ? 'var(--orange)' : 'rgba(255,255,255,0.2)', backgroundColor: activeCategory === cat ? 'var(--orange)' : 'transparent', color: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#bbb', marginBottom: '1.75rem', letterSpacing: '0.04em' }}>
          {filtered.length} {filtered.length === 1 ? 'essay' : 'essays'}{activeCategory ? ` in ${activeCategory}` : ''}
        </p>

        {isInitialLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ backgroundColor: 'var(--background-2)', padding: '5rem', textAlign: 'center', borderRadius: '20px', animation: 'fadeIn 0.4s ease both' }}>
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.5rem', color: '#aaa' }}>NO ESSAYS MATCH YOUR SEARCH</p>
            <button className="btn-dark" style={{ marginTop: '1.5rem' }} onClick={() => { setSearch(''); handleCat(null) }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {paginated.map((post, i) => (
              <RevealCard key={post.id} delay={(i % 3) * 0.07}>
                <PostCard post={post} />
              </RevealCard>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, padding: '0.55rem 1.2rem', borderRadius: '100px', border: '1.5px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: page === 1 ? '#ccc' : '#111', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 700, width: '38px', height: '38px', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: page === i + 1 ? 'var(--orange)' : 'transparent', color: page === i + 1 ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
              style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, padding: '0.55rem 1.2rem', borderRadius: '100px', border: '1.5px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: page === totalPages ? '#ccc' : '#111', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
