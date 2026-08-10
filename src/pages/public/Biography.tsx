import { Link } from 'react-router'
import Reveal from '../../components/public/Reveal'
import portraitImg from '../../imports/1740246463274.jpeg'
import profSpeaking from '../../imports/images.jpeg'
import profRegalia from '../../imports/images__1_.png'
import profPodium from '../../imports/images.png'

const IMG = {
  hero: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1400&h=600&fit=crop&auto=format',
  g1: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&h=650&fit=crop&auto=format',
  g2: 'https://images.unsplash.com/flagged/photo-1559264243-77e7b0942b77?w=500&h=650&fit=crop&crop=top&auto=format',
  g3: 'https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?w=500&h=650&fit=crop&auto=format',
  g4: 'https://images.unsplash.com/photo-1627556704283-452301a45fd0?w=500&h=650&fit=crop&auto=format',
  cta: 'https://images.unsplash.com/photo-1587397070638-81d3cce10435?w=900&h=520&fit=crop&auto=format',
}

const sections = [
  { heading: 'Academic Formation', content: `Mahfouz Adedimeji was born in Kwara State, Nigeria, and received his early education in the state before proceeding to Usmanu Danfodiyo University, Sokoto, for his undergraduate studies in English Language and Linguistics. He subsequently earned his Master's degree and Doctor of Philosophy in Linguistics from the University of Ilorin.\n\nHis doctoral research, which examined politeness strategies in Nigerian academic discourse, established the methodological and theoretical preoccupations that would characterise three decades of subsequent scholarship.` },
  { heading: 'Academic Career', content: `Prof. Adedimeji joined the University of Ilorin as a junior lecturer and rose steadily through the ranks to become a full Professor of Pragmatics and Applied Linguistics. He has served in various administrative capacities at the university, bringing scholarly rigour and institutional commitment to each role.\n\nHis teaching spans Pragmatics, Discourse Analysis, Sociolinguistics, and English Language Communication Skills.` },
  { heading: 'Fulbright Scholarship', content: `Prof. Adedimeji was awarded a Fulbright Scholar-in-Residence fellowship — one of the most competitive academic exchange awards in the world — which took him to the United States for an extended period of research and teaching.\n\nHis reflections on this experience have become among his most widely read pieces, appreciated by academics, policymakers, and general readers seeking honest comparative analysis of Nigerian and American universities.` },
  { heading: 'Administrative Leadership', content: `Beyond his scholarly contributions, Prof. Adedimeji has served in significant administrative roles within Nigerian higher education, navigating the complex intersection of institutional governance, resource management, and the maintenance of academic standards.\n\nHis writings on university governance in Nigeria — candid, evidence-based, and unsparing — draw on this direct administrative experience.` },
  { heading: 'Research Contributions', content: `Prof. Adedimeji's research spans three principal domains: theoretical pragmatics (politeness theory, speech act theory), applied sociolinguistics (code-switching, language attitudes, language policy), and critical discourse studies (the language of insurgency, political rhetoric, and media representation).\n\nHis publications include sole-authored monographs, book chapters in international collections, and articles in SCOPUS and Web of Science indexed journals.` },
  { heading: 'Public Intellectual Work', content: `Alongside his academic career, Prof. Adedimeji has maintained a sustained presence as a public intellectual. His categories — Edupeace, Books Review, The Alma Mater, Renaissance, Give & Take, and Islam — constitute a substantial body of engaged commentary.\n\nThe same precision and commitment to honest analysis that characterise his academic writing are evident in every essay on this site.` },
  { heading: 'Awards & Fellowships', content: `In addition to the Fulbright fellowship, Prof. Adedimeji has received awards for excellence in teaching and research from the University of Ilorin and recognition from professional associations including the Linguistic Association of Nigeria.\n\nHe is a Fellow of several learned societies and has served as a reviewer for international journals and as an external examiner for universities across Nigeria and West Africa.` },
  { heading: 'Personal', content: `Prof. Adedimeji is a Muslim of Yoruba heritage whose faith and cultural identity are integrated into his intellectual life rather than compartmentalised from it. His writing on Islam — reflective, theologically informed, and accessible — reflects the depth of a scholar who reads the Islamic intellectual tradition seriously alongside the Western academy.` },
]


const galleryImages = [
  { src: portraitImg, label: 'Prof. Mahfouz Adedimeji' },
  { src: profSpeaking, label: 'Speaking at public forum' },
  { src: profRegalia, label: 'In full academic regalia' },
  { src: profPodium, label: 'Addressing a national audience' },
]

export default function Biography() {
  return (
    <div style={{ backgroundColor: '#fff', overflowX: 'hidden' }}>
      {/* Hero */}
      <div style={{ position: 'relative', backgroundColor: 'var(--card-dark)', padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <img src={IMG.hero} alt="Academic backdrop"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.22 }} />
        <div className="page-inner-lg grid-hero-meta" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ animation: 'fadeInLeft 0.7s ease both' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.75rem' }}>Academic Profile</p>
            <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: 'clamp(2.5rem, 8vw, 7rem)', color: '#fff', lineHeight: 0.9, marginBottom: '1.25rem' }}>
              BIOGRAPHY
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, maxWidth: '500px' }}>
              Professor of Pragmatics and Applied Linguistics · Fulbright Scholar · Public Intellectual — a career spanning three decades of scholarship, teaching, and engaged writing.
            </p>
          </div>
          <div style={{ animation: 'scaleIn 0.7s 0.15s ease both', flexShrink: 0 }} className="hide-mobile">
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--orange)', boxShadow: '0 8px 28px rgba(244,120,32,0.5)', backgroundColor: '#333' }}>
              <img src={portraitImg} alt="Prof. Mahfouz Adedimeji" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-inner-md">
        {/* Quick facts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', margin: '3rem 0' }}>
            {[
              { label: 'Position', value: 'Professor of Pragmatics & Applied Linguistics' },
              { label: 'Institution', value: 'University of Ilorin, Nigeria' },
              { label: 'Fellowship', value: 'Fulbright Scholar-in-Residence' },
              { label: 'Research Areas', value: 'Pragmatics · Discourse Analysis · Sociolinguistics' },
            ].map(({ label, value }, idx) => (
              <Reveal key={label} delay={idx * 0.09}>
                <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '1.5rem', borderTop: '3px solid var(--orange)', transition: 'transform 0.2s, box-shadow 0.2s', height: '100%' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: '#111', lineHeight: 1.5, fontWeight: 600 }}>{value}</p>
                </div>
              </Reveal>
            ))}
        </div>

        {/* Photo gallery */}
        <div style={{ marginBottom: '3.5rem' }}>
          <Reveal>
            <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '1rem', letterSpacing: '0.05em' }}>/ Photo Gallery</p>
          </Reveal>
          <div className="grid-4col-gallery">
            {galleryImages.map((g, i) => (
              <Reveal key={i} dir="scale" delay={i * 0.1}>
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', aspectRatio: '3/4', position: 'relative', backgroundColor: '#eee' }}>
                  <img src={g.src} alt={g.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 50%)' }} />
                  <p style={{ position: 'absolute', bottom: '0.625rem', left: '0.625rem', right: '0.625rem', fontFamily: 'Inter', fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>{g.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ marginBottom: '5rem' }}>
          {sections.map((s, i) => (
            <Reveal key={i} delay={0.04}>
              <div className="grid-bio-section">
                <div>
                  <div style={{ width: '20px', height: '3px', backgroundColor: 'var(--orange)', borderRadius: '2px', marginBottom: '0.75rem' }} />
                  <h2 style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 700, color: '#111', lineHeight: 1.4, letterSpacing: '0.03em' }}>{s.heading}</h2>
                </div>
                <div>
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j} style={{ fontFamily: 'Inter', fontSize: '0.95rem', color: '#555', lineHeight: 1.85, marginBottom: '1rem' }}>{para}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: 'var(--background-2)', padding: '5rem 0' }}>
        <div className="page-inner-md grid-2col">
          <Reveal dir="left">
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--foreground)', lineHeight: 1.25, marginBottom: '1rem' }}>
              Read his scholarly work
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Over 80 peer-reviewed publications spanning three decades — books, book chapters, and journal articles indexed in SCOPUS and Web of Science.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/publications" className="btn-orange">View Publications</Link>
              <Link to="/blog" className="btn-outline">Read Essays</Link>
            </div>
          </Reveal>
          <Reveal dir="right">
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#eee' }}>
              <img src={IMG.cta} alt="Academic library" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
