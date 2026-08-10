import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import usePosts from '../../hooks/usePosts'
import PostCard from '../../components/public/PostCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import profSpeaking from '../../imports/images.jpeg'
import heroImg1 from '../../imports/mahfouz-adedimeji.jpg'
import heroImg2 from '../../imports/FB_IMG_1607423277709-720x375-1.jpg'
import heroImg3 from '../../imports/WhatsApp-Image-2025-09-17-at-10.01.26-1045x698.jpeg'

const HERO_SLIDES = [
  { src: heroImg1, alt: 'Mahfouz Adedimeji' },
  { src: heroImg2, alt: 'Mahfouz Adedimeji speaking' },
  { src: heroImg3, alt: 'Mahfouz Adedimeji portrait' },
]

const IMG = {
  hero: HERO_SLIDES[0].src,
  portrait: profSpeaking,
  lecture: 'https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?w=700&h=420&fit=crop&auto=format',
  classroom: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=700&h=420&fit=crop&auto=format',
  strip1: 'https://images.unsplash.com/photo-1587397070638-81d3cce10435?w=800&h=500&fit=crop&auto=format',
  strip2: 'https://images.unsplash.com/photo-1741708011528-e4874c6d869e?w=800&h=500&fit=crop&auto=format',
  strip3: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&h=500&fit=crop&auto=format',
  faq: 'https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=700&h=520&fit=crop&auto=format',
  cta: 'https://images.unsplash.com/photo-1623461487986-9400110de28e?w=1400&h=600&fit=crop&auto=format',
}

const STATS = [
  { value: '30+', label: 'years of teaching\nat University of Ilorin' },
  { value: '80+', label: 'peer-reviewed\npublications' },
  { value: '6', label: 'essay categories\ncovering key themes' },
  { value: '1', label: 'Fulbright Scholar\nfellowship' },
]

const FEATURES = [
  { dark: true,  title: 'Language as a tool for peace and understanding', desc: "Prof. Adedimeji's Edupeace initiative harnesses linguistic scholarship to build bridges across communities and cultures.", icon: '◆', img: null },
  { dark: false, title: 'Three decades of classroom excellence', desc: "Teaching Pragmatics, Discourse Analysis, and Sociolinguistics at one of Nigeria's leading universities.", icon: null, img: IMG.lecture },
  { dark: false, title: 'Fulbright Scholar — comparative academic insights', desc: 'A rare, competitive fellowship that carried his scholarship to the United States.', icon: null, img: IMG.classroom },
  { dark: false, title: 'Fixed scholarly record — books, chapters, articles', desc: 'Over 80 publications spanning SCOPUS and Web of Science indexed journals.', icon: '◈', img: null },
  { dark: false, title: 'Public intellectual across six essay categories', desc: 'Edupeace · Books Review · The Alma Mater · Renaissance · Give & Take · Islam', icon: '◉', img: null },
  { dark: true,  title: 'Rigorous, honest, and accessible writing', desc: 'The same precision that defines his academic work is present in every essay — evidence-based commentary on language, education, and society.', icon: '◑', img: null },
]

function OrangeIcon({ icon, dark }: { icon: string; dark: boolean }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: dark ? 'rgba(244,120,32,0.22)' : 'var(--orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '0.5rem' }}>
      <span style={{ color: 'var(--orange)', fontSize: '1rem' }}>{icon}</span>
    </div>
  )
}

function Reveal({ children, dir = 'up', delay = 0, style = {}, className = '' }: {
  children: React.ReactNode; dir?: 'up'|'left'|'right'|'scale'; delay?: number; style?: React.CSSProperties; className?: string
}) {
  const { ref, visible } = useScrollReveal()
  const base = dir === 'left' ? 'reveal-left-' : dir === 'right' ? 'reveal-right-' : dir === 'scale' ? 'reveal-scale-' : 'reveal-'
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`${visible ? `${base}visible` : `${base}hidden`} ${className}`}
      style={{ ...style, transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

export default function Home() {
  const { posts } = usePosts()
  const featured = posts.filter(p => p.status === 'published').slice(0, 5)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const faqs = [
    { q: 'What does "Edupeace" mean?', a: "Edupeace is Prof. Adedimeji's framework for using education and language scholarship as instruments of peace-building across communities." },
    { q: 'Can I contact Prof. Adedimeji for academic collaboration?', a: 'Yes — academic correspondence, media enquiries, and speaking invitations are all welcome via the Contact page.' },
    { q: 'Are his publications available to read?', a: 'The Publications page catalogues all peer-reviewed books, book chapters, and journal articles with direct links.' },
    { q: 'What university is he affiliated with?', a: 'Prof. Adedimeji is a Professor of Pragmatics and Applied Linguistics at the University of Ilorin, Nigeria.' },
  ]

  return (
    <div style={{ backgroundColor: '#fff', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#111', minHeight: 'clamp(360px, 55vh, 560px)', display: 'flex', alignItems: 'center' }}>
        {HERO_SLIDES.map((slide, i) => (
          <img key={i} src={slide.src} alt={slide.alt}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 30%',
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 1.2s ease',
              willChange: 'opacity',
            }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 50%, rgba(10,10,10,0.25) 100%)', zIndex: 1 }} />
        <div className="page-inner" style={{ position: 'relative', zIndex: 2, padding: 'clamp(2.5rem,6vw,4rem) 1.5rem', width: '100%' }}>
          <div style={{ maxWidth: '640px', animation: 'fadeInLeft 0.8s ease both' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.85rem' }}>
              Professor of Pragmatics · Fulbright Scholar
            </p>
            <h1 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
              Language, scholarship,<br />and the pursuit of peace
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '480px' }}>
              Thirty years of rigorous scholarship in Pragmatics and Applied Linguistics — translated into essays, books, and public writing.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/blog" className="btn-orange">Explore Essays</Link>
              <Link to="/biography" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.35)' }}>
                About
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[{ num: '30+', label: 'Years Teaching' }, { num: '80+', label: 'Publications' }, { num: '1', label: 'Fulbright Scholar' }].map(s => (
                <div key={s.num}>
                  <p style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.5rem', color: 'var(--orange)', lineHeight: 1 }}>{s.num}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === heroIdx ? 24 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                backgroundColor: i === heroIdx ? 'var(--orange)' : 'rgba(255,255,255,0.35)',
                transition: 'width 0.4s ease, background-color 0.3s ease',
                padding: 0,
              }} />
          ))}
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="page-inner grid-4col-stats">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} style={{ padding: '1.5rem 1rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.75rem', color: 'var(--orange)', lineHeight: 1, flexShrink: 0 }}>{s.value}</span>
              <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#999', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── PROFESSOR SPOTLIGHT ── */}
      <div style={{ backgroundColor: 'var(--card-dark)' }}>
        <div className="page-inner grid-2col" style={{ padding: '5rem 1.5rem' }}>
          <Reveal dir="left" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5', maxWidth: '420px', backgroundColor: '#222' }}>
              <img src={IMG.portrait} alt="Scholar reading"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>Prof. Mahfouz Adedimeji</p>
                <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>University of Ilorin · Fulbright Scholar</p>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-1.5rem', right: '0', backgroundColor: 'var(--orange)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', boxShadow: '0 8px 24px rgba(244,120,32,0.45)' }}>
              <p style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#fff', lineHeight: 1 }}>30+</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.2rem' }}>Years of Teaching</p>
            </div>
          </Reveal>
          <Reveal dir="right">
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: 'var(--orange)', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>/ The Scholar</p>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              A life dedicated to<br />language and learning
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
              Professor of Pragmatics and Applied Linguistics at the University of Ilorin, Prof. Mahfouz Adedimeji has shaped the scholarly landscape of Nigerian linguistics over three remarkable decades — in the classroom, in print, and in public discourse.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/biography" className="btn-orange">Read Biography</Link>
              <Link to="/publications" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '0.7rem 1.6rem', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.22)' }}>
                Publications
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── FEATURES GRID ── */}
      <div style={{ padding: '5rem 0' }}>
        <div className="page-inner">
          <Reveal>
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '0.75rem' }}>/ Research & Writing</p>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', color: 'var(--foreground)', marginBottom: '2.5rem', lineHeight: 1.2 }}>
              Why scholars and readers<br />trust this work
            </h2>
          </Reveal>
          <div className="grid-3col">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.07} style={{
                backgroundColor: f.dark ? 'var(--card-dark)' : '#fff',
                borderRadius: 'var(--radius)',
                border: f.dark ? 'none' : '1px solid var(--border)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>
                {f.img && (
                  <div style={{ height: 190, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    <img src={f.img} alt={f.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
                  </div>
                )}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {f.icon && <OrangeIcon icon={f.icon} dark={f.dark} />}
                  <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.95rem', color: f.dark ? '#fff' : 'var(--foreground)', lineHeight: 1.4 }}>{f.title}</h3>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: f.dark ? 'rgba(255,255,255,0.45)' : '#999', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── IMAGE STRIP (desktop only) ── */}
      <div className="image-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', height: 240, gap: 4 }}>
        {[IMG.strip1, IMG.strip2, IMG.strip3].map((src, i) => (
          <div key={i} style={{ overflow: 'hidden', position: 'relative', backgroundColor: '#111' }}>
            <img src={src} alt="Academic setting"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)')}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.3)' }} />
          </div>
        ))}
      </div>

      {/* ── ESSAYS CTA ── */}
      <div style={{ backgroundColor: 'var(--background-2)', padding: '5rem 0' }}>
        <div className="page-inner grid-2col">
          <Reveal dir="left">
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '0.75rem' }}>/ Essay Archive</p>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--foreground)', lineHeight: 1.25, marginBottom: '1rem' }}>
              Essays spanning six<br />categories of thought
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              From the language of insurgency to reflections on the American university — each essay carries the precision of a trained linguist and the voice of a public intellectual.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              {['Edupeace','Books Review','The Alma Mater','Renaissance','Give & Take','Islam'].map(cat => (
                <Link key={cat} to="/blog"
                  style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '100px', backgroundColor: '#fff', border: '1px solid var(--border)', color: '#666', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--orange)'; el.style.color = 'var(--orange)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = '#666' }}>
                  {cat}
                </Link>
              ))}
            </div>
            <Link to="/blog" className="btn-orange">Browse All Essays</Link>
          </Reveal>
          <Reveal dir="right">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Edupeace', color: '#F47820', desc: 'Language as a peace-building tool' },
                { label: 'The Alma Mater', color: '#2563EB', desc: 'University life and governance' },
                { label: 'Books Review', color: '#047857', desc: 'Critical literary commentary' },
                { label: 'Islam', color: '#7C3AED', desc: 'Theological and cultural reflection' },
              ].map(c => (
                <div key={c.label} style={{ backgroundColor: '#fff', borderRadius: 'var(--radius)', padding: '1.25rem', border: '1px solid var(--border)', borderTop: `3px solid ${c.color}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}>
                  <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.875rem', color: c.color, marginBottom: '0.35rem' }}>{c.label}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#aaa', lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── RECENT ESSAYS ── */}
      {featured.length > 0 && (
        <div style={{ padding: '5rem 0' }}>
          <div className="page-inner">
            <Reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '0.4rem' }}>/ Latest Writing</p>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.75rem', color: 'var(--foreground)' }}>Recent Essays</h2>
              </div>
              <Link to="/blog" style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 600, color: 'var(--orange)', textDecoration: 'none' }}>View all →</Link>
            </Reveal>
            <div className="grid-3col">
              {featured.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      <div style={{ backgroundColor: 'var(--background-2)', padding: '5rem 0' }}>
        <div className="page-inner grid-2col" style={{ alignItems: 'start' }}>
          <Reveal dir="left">
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '0.75rem' }}>/ Common Questions</p>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--foreground)', lineHeight: 1.25, marginBottom: '2rem' }}>
              Frequently asked<br />questions
            </h2>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: '#f0f0f0' }}>
              <img src={IMG.faq} alt="Open book research" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Reveal>
          <Reveal dir="right">
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                  <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9rem', color: 'var(--foreground)', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ color: faqOpen === i ? 'var(--orange)' : '#ccc', fontSize: '1.2rem', flexShrink: 0, transition: 'color 0.2s, transform 0.3s', display: 'inline-block', transform: faqOpen === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div style={{ maxHeight: faqOpen === i ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', lineHeight: 1.75, paddingBottom: '1.25rem' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ padding: '5rem 0' }}>
        <div className="page-inner">
          <Reveal dir="scale" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
            <img src={IMG.cta} alt="Academic graduation"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(18,18,18,0.87)' }} />
            <div className="grid-cta" style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem,4vw,3.5rem)' }}>
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', color: '#fff', lineHeight: 1.25, marginBottom: '0.6rem' }}>
                  Explore the full publication archive
                </h2>
                <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>
                  Thirty years of peer-reviewed books, book chapters, and journal articles — all catalogued and searchable.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/publications" className="btn-orange">View Publications</Link>
                <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.22)' }}>
                  Get in Touch
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  )
}
