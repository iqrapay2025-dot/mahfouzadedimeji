import React from 'react'
import type { Publication } from '../../context/AppContext'

const typeLabel: Record<Publication['type'], string> = {
  book: 'Book',
  chapter: 'Book Chapter',
  article: 'Journal Article',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Inter',
  fontSize: '0.85rem',
  padding: '0.7rem 1rem',
  border: '1.5px solid rgba(0,0,0,0.1)',
  color: '#111',
  outline: 'none',
  backgroundColor: '#fafafa',
  borderRadius: '12px',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#aaa',
  display: 'block',
  marginBottom: '0.45rem',
}

const formSectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1rem',
}

function fieldProps<K extends keyof Publication>(
  publication: Partial<Publication>,
  onChange: (value: Publication[K]) => void,
  name: K,
): {
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
} {
  return {
    value: (publication[name] ?? '') as string | number,
    onChange: event => onChange((event.target.value as unknown) as Publication[K]),
  }
}

export type PublicationEditorProps = {
  publication: Partial<Publication>
  mode: 'create' | 'edit'
  onChange: (updated: Partial<Publication>) => void
  onSave: () => Promise<void>
  onCancel: () => void
}

export default function PublicationEditor({
  publication,
  mode,
  onChange,
  onSave,
  onCancel,
}: PublicationEditorProps) {
  const [errors, setErrors] = React.useState<Record<string,string>>({})
  const pubType = publication.type ?? 'book'
  const title = mode === 'create' ? `New ${typeLabel[pubType]}` : `Edit ${typeLabel[pubType]}`

  const updateField = <K extends keyof Publication>(key: K, value: Publication[K]) => {
    onChange({ ...publication, [key]: value })
  }

  const requiredWarning =
    !publication.title || !publication.authors || !publication.year ||
    ((pubType === 'book' || pubType === 'chapter') && !publication.publisher) ||
    (pubType === 'article' && !publication.journal)

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.07)', borderTop: '3px solid var(--orange)', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: '#666', marginBottom: '0.35rem' }}>Publication Details</p>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', lineHeight: 1.1, margin: 0 }}>{title}</h2>
        </div>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
      </div>

      <div style={formSectionStyle}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            maxLength={500}
            {...fieldProps(publication, value => updateField('title', value), 'title')}
            style={inputStyle}
            placeholder="Full publication title"
          />
          {errors.title && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.title}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Author(s) *</label>
            <input
              type="text"
              {...fieldProps(publication, value => updateField('authors', value), 'authors')}
              style={inputStyle}
              placeholder="Surname, First"
            />
            {errors.authors && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.authors}</p>}
          </div>
          <div>
            <label style={labelStyle}>Year *</label>
            <input
              type="number"
              {...fieldProps(publication, value => updateField('year', Number(value) as Publication['year']), 'year')}
              style={inputStyle}
              min={1900}
              max={2030}
            />
            {errors.year && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.year}</p>}
          </div>
        </div>

        {(pubType === 'book' || pubType === 'chapter') && (
          <div>
            <label style={labelStyle}>Publisher *</label>
            <input
              type="text"
              {...fieldProps(publication, value => updateField('publisher', value), 'publisher')}
              style={inputStyle}
              placeholder="Publisher name"
            />
            {errors.publisher && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.publisher}</p>}
          </div>
        )}

        {pubType === 'chapter' && (
          <div>
            <label style={labelStyle}>Editor(s)</label>
            <input
              type="text"
              {...fieldProps(publication, value => updateField('editors', value), 'editors')}
              style={inputStyle}
              placeholder="Surname, A. et al."
            />
            {errors.editors && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.editors}</p>}
          </div>
        )}

        {pubType === 'article' && (
          <>
            <div>
              <label style={labelStyle}>Journal Name *</label>
              <input
                type="text"
                {...fieldProps(publication, value => updateField('journal', value), 'journal')}
                style={inputStyle}
                placeholder="Journal or periodical title"
              />
              {errors.journal && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.journal}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Volume</label>
                <input
                  type="text"
                  {...fieldProps(publication, value => updateField('volume', value), 'volume')}
                  style={inputStyle}
                  maxLength={60}
                />
              </div>
              <div>
                <label style={labelStyle}>Issue</label>
                <input
                  type="text"
                  {...fieldProps(publication, value => updateField('issue', value), 'issue')}
                  style={inputStyle}
                    maxLength={60}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>DOI</label>
              <input
                type="text"
                {...fieldProps(publication, value => updateField('doi', value), 'doi')}
                style={inputStyle}
                placeholder="10.xxxx/xxxxxxx"
                maxLength={200}
              />
              {errors.doi && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.doi}</p>}
            </div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: pubType === 'book' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Pages</label>
            <input
              type="text"
              {...fieldProps(publication, value => updateField('pages', value), 'pages')}
              style={inputStyle}
              placeholder="e.g. 112–138"
              maxLength={60}
            />
          </div>
          {pubType === 'book' && (
            <div>
              <label style={labelStyle}>ISBN</label>
              <input
                type="text"
                {...fieldProps(publication, value => updateField('isbn', value), 'isbn')}
                style={inputStyle}
                placeholder="ISBN number"
                maxLength={60}
              />
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Link</label>
          <input
            type="text"
            {...fieldProps(publication, value => updateField('url', value), 'url')}
            style={inputStyle}
            placeholder="Optional URL or DOI link"
            maxLength={400}
          />
          {errors.url && <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.4rem' }}>{errors.url}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          onClick={onSave}
          disabled={Boolean(requiredWarning)}
          style={{
            border: 'none',
            cursor: requiredWarning ? 'not-allowed' : 'pointer',
            backgroundColor: requiredWarning ? '#ddd' : 'var(--orange)',
            color: requiredWarning ? '#888' : '#fff',
            padding: '0.9rem 1.4rem',
            borderRadius: '100px',
            fontFamily: 'Inter',
            fontWeight: 700,
          }}
        >
          {mode === 'create' ? 'Save Publication' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          style={{
            border: '1.5px solid rgba(0,0,0,0.1)',
            background: 'transparent',
            color: '#111',
            padding: '0.9rem 1.4rem',
            borderRadius: '100px',
            fontFamily: 'Inter',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
      {requiredWarning && (
        <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#b91c1c', marginTop: '1rem' }}>
          Please complete all required fields before saving.
        </p>
      )}
    </div>
  )
}
