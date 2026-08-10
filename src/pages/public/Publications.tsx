import { useState, useMemo } from 'react'
import usePublications from '../../hooks/usePublications'
import type { Publication } from '../../context/AppContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Reveal from '../../components/public/Reveal'

const HERO_IMG = 'https://images.unsplash.com/photo-1741795822013-570c944ac5bd?w=1600&h=600&fit=crop&auto=format'

type PubType = 'all' | 'book' | 'chapter' | 'article'

const TYPE_META = {
  book:    { label: 'Book',           color: '#F47820', bg: 'rgba(244,120,32,0.10)', border: '#F47820' },
  chapter: { label: 'Book Chapter',   color: '#047857', bg: 'rgba(4,120,87,0.10)',   border: '#047857' },
  article: { label: 'Journal Article',color: '#6d28d9', bg: 'rgba(109,40,217,0.10)', border: '#6d28d9' },
}

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={visible ? 'reveal-visible' : 'reveal-hidden'}
      style={{ transitionDelay: delay ? `${delay}s` : undefined, height: '100%' }}>
      {children}
    </div>
  )
}

function PubCard({ pub }: { pub: Publication }) {
  const meta = TYPE_META[pub.type]
  const yearLabel = pub.year === 0 ? 'n.d.' : String(pub.year)

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '18px',
      border: '1px solid rgba(0,0,0,0.07)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'box-shadow 0.22s, transform 0.22s',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'
        el.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
      }}>

      {/* Colored top bar */}
      <div style={{ height: '4px', backgroundColor: meta.border, flexShrink: 0 }} />

      <div style={{ padding: '1.4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>

        {/* Top row: year + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Manrope', fontWeight: 900,
            fontSize: yearLabel === 'n.d.' ? '1rem' : '1.5rem',
            color: meta.color, lineHeight: 1, letterSpacing: '-0.02em',
          }}>
            {yearLabel}
          </span>
          <span style={{
            fontFamily: 'Inter', fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase',
            color: meta.color, backgroundColor: meta.bg,
            padding: '0.25rem 0.75rem', borderRadius: '100px', whiteSpace: 'nowrap',
          }}>
            {meta.label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.92rem',
          color: '#111', lineHeight: 1.4, flex: 1,
        }}>
          {pub.title}
        </h3>

        {/* Authors */}
        <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#888', lineHeight: 1.5 }}>
          {pub.authors}
          {pub.editors && <span style={{ color: '#bbb' }}> · Ed. {pub.editors}</span>}
        </p>

        {/* Venue */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem 0.75rem', alignItems: 'center' }}>
          {pub.publisher && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#aaa' }}>{pub.publisher}</span>
          )}
          {pub.journal && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#aaa', fontStyle: 'italic' }}>
              {pub.journal}{pub.volume ? `, ${pub.volume}(${pub.issue})` : ''}
            </span>
          )}
          {pub.pages && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#ccc' }}>pp. {pub.pages}</span>
          )}
          {pub.isbn && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: '#ccc' }}>ISBN: {pub.isbn}</span>
          )}
        </div>

        {/* Action links */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {pub.doi && (
            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600,
                color: 'var(--orange)', textDecoration: 'none',
                padding: '0.3rem 0.8rem', borderRadius: '100px',
                border: '1.5px solid var(--orange)',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--orange)'; el.style.color = '#fff' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--orange)' }}>
              DOI ↗
            </a>
          )}
          {pub.url && (
            <a href={pub.url} target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600,
                color: '#1d7ab8', textDecoration: 'none',
                padding: '0.3rem 0.8rem', borderRadius: '100px',
                border: '1.5px solid #1d7ab8',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#1d7ab8'; el.style.color = '#fff' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#1d7ab8' }}>
              ResearchGate ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Publications() {
  const { publications } = usePublications()
  const [activeType, setActiveType] = useState<PubType>('all')
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  const years = useMemo(() =>
    [...new Set(publications.map(p => p.year))].sort((a, b) => b - a),
    [publications])

  const filtered = useMemo(() => publications
    .filter(p => activeType === 'all' || p.type === activeType)
    .filter(p => !yearFilter || p.year === Number(yearFilter))
    .filter(p => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return p.title.toLowerCase().includes(q)
        || p.authors.toLowerCase().includes(q)
        || (p.journal ?? '').toLowerCase().includes(q)
        || (p.publisher ?? '').toLowerCase().includes(q)
    })
    .sort((a, b) => b.year - a.year),
    [publications, activeType, search, yearFilter])

  const counts = useMemo(() => ({
    all: publications.length,
    book: publications.filter(p => p.type === 'book').length,
    chapter: publications.filter(p => p.type === 'chapter').length,
    article: publications.filter(p => p.type === 'article').length,
  }), [publications])

  const tabs: { key: PubType; label: string }[] = [
    { key: 'all',     label: `All (${counts.all})` },
    { key: 'book',    label: `Books (${counts.book})` },
    { key: 'chapter', label: `Chapters (${counts.chapter})` },
    { key: 'article', label: `Articles (${counts.article})` },
  ]

  return (
    <div style={{ backgroundColor: '#F7F7F7', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', backgroundColor: '#0f0f0f', padding: 'clamp(3.5rem,7vw,5.5rem) 0 clamp(2.5rem,5vw,4rem)', overflow: 'hidden' }}>
        <img src={HERO_IMG} alt="Library"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', animation: 'fadeInUp 0.7s ease both' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.6rem' }}>
            Scholarly Output
          </p>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(2.4rem, 8vw, 6rem)', color: '#fff', lineHeight: 0.95, marginBottom: '1rem' }}>
            PUBLICATIONS
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: '500px' }}>
            Books, book chapters, and peer-reviewed journal articles spanning three decades of work in Pragmatics, Applied Linguistics, and Discourse Studies.
          </p>
        </div>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>

          {/* Type tabs — horizontally scrollable on mobile */}
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveType(t.key)}
                style={{
                  fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600,
                  padding: '1rem 1.1rem', whiteSpace: 'nowrap', cursor: 'pointer',
                  background: 'none', border: 'none',
                  borderBottom: activeType === t.key ? '2.5px solid var(--orange)' : '2.5px solid transparent',
                  color: activeType === t.key ? 'var(--orange)' : '#888',
                  transition: 'color 0.15s, border-color 0.15s',
                  flexShrink: 0,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH + YEAR ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.25rem 0' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text" placeholder="Search by title, author, journal…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', fontFamily: 'Inter', fontSize: '0.82rem',
                padding: '0.65rem 1rem 0.65rem 2.2rem',
                border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '10px',
                outline: 'none', backgroundColor: '#fff', color: '#111',
                transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
          </div>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            style={{
              fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600,
              padding: '0.65rem 1rem', border: '1.5px solid rgba(0,0,0,0.1)',
              backgroundColor: '#fff', color: '#111', cursor: 'pointer',
              outline: 'none', borderRadius: '10px', flexShrink: 0,
            }}>
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y === 0 ? 'n.d.' : y}</option>)}
          </select>
          <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.25rem 5rem' }}>
        {filtered.length === 0 ? (
          <Reveal>
            <div style={{ backgroundColor: '#fff', padding: '4rem 2rem', textAlign: 'center', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#aaa' }}>No publications match</p>
              <button onClick={() => { setSearch(''); setYearFilter(''); setActiveType('all') }}
                style={{ marginTop: '1rem', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Clear filters
              </button>
            </div>
          </Reveal>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '1rem',
          }}>
            {filtered.map((pub, i) => (
              <RevealCard key={pub.id} delay={(i % 6) * 0.05}>
                <PubCard pub={pub} />
              </RevealCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
