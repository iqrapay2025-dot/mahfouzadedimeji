import type { Publication } from '../../context/AppContext'

type PubType = Publication['type']

const typeLabel: Record<PubType, string> = {
  book: 'Book',
  chapter: 'Book Chapter',
  article: 'Journal Article',
}

const buttonStyle = (active = false): React.CSSProperties => ({
  fontFamily: 'Inter',
  fontSize: '0.8rem',
  fontWeight: 600,
  padding: '0.5rem 1.1rem',
  borderRadius: '100px',
  border: '1.5px solid',
  borderColor: active ? 'var(--orange)' : 'rgba(0,0,0,0.1)',
  backgroundColor: active ? 'var(--orange)' : 'transparent',
  color: active ? '#fff' : '#888',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export type PublicationListProps = {
  publications: Publication[]
  activeType: PubType
  counts: Record<PubType, number>
  search: string
  onSearch: (value: string) => void
  onSelectType: (type: PubType) => void
  onEdit: (publication: Publication) => void
  onDelete: (id: string) => void
}

export default function PublicationList({
  publications,
  activeType,
  counts,
  search,
  onSearch,
  onSelectType,
  onEdit,
  onDelete,
}: PublicationListProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        {(['book', 'chapter', 'article'] as PubType[]).map(type => (
          <button key={type} type="button" onClick={() => onSelectType(type)} style={buttonStyle(type === activeType)}>
            {typeLabel[type]}s ({counts[type]})
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search publications"
          style={{
            fontFamily: 'Inter',
            fontSize: '0.82rem',
            padding: '0.5rem 1.1rem',
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: '100px',
            outline: 'none',
            minWidth: '200px',
            backgroundColor: '#fff',
            color: '#111',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </div>

      {publications.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '3rem', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#ddd' }}>
            No {typeLabel[activeType]}s found
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {publications.map(pub => (
            <div key={pub.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid rgba(0,0,0,0.08)', display: 'grid', gap: '0.65rem', gridTemplateColumns: '1fr auto', alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.55rem' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase' }}>{typeLabel[pub.type]}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#999' }}>{pub.year}</span>
                </div>
                <p style={{ fontFamily: 'Manrope', fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111' }}>{pub.title}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#666', margin: '0.45rem 0 0' }}>{pub.authors}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#777', marginTop: '0.75rem', lineHeight: 1.55 }}>
                  {pub.publisher ? <span>Publisher: {pub.publisher}</span> : null}
                  {pub.journal ? <span>{pub.publisher ? ' · ' : ''}Journal: {pub.journal}</span> : null}
                  {pub.volume ? <span>{pub.journal ? ' · ' : ''}Vol. {pub.volume}</span> : null}
                  {pub.issue ? <span>{pub.issue ? ` (${pub.issue})` : ''}</span> : null}
                  {pub.pages ? <span>{pub.pages ? ` · pp. ${pub.pages}` : ''}</span> : null}
                  {pub.doi ? <span>{pub.doi ? ` · DOI: ${pub.doi}` : ''}</span> : null}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-start' }}>
                <button type="button" onClick={() => onEdit(pub)} style={{ border: '1.5px solid var(--orange)', background: 'transparent', color: 'var(--orange)', padding: '0.55rem 0.9rem', borderRadius: '100px', fontFamily: 'Inter', fontWeight: 700, cursor: 'pointer' }}>
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(pub.id)} style={{ border: '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', color: '#888', padding: '0.55rem 0.9rem', borderRadius: '100px', fontFamily: 'Inter', fontWeight: 700, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
