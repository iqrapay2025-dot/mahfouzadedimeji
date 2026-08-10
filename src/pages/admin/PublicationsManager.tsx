import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Publication } from '../../context/AppContext'
import PublicationEditor from '../../components/admin/PublicationEditor'
import PublicationList from '../../components/admin/PublicationList'

type PubType = Publication['type']

const emptyBook = (): Omit<Publication, 'id'> => ({ type: 'book', title: '', authors: '', year: new Date().getFullYear(), publisher: '', pages: '', isbn: '' })
const emptyChapter = (): Omit<Publication, 'id'> => ({ type: 'chapter', title: '', authors: '', year: new Date().getFullYear(), publisher: '', pages: '', editors: '' })
const emptyArticle = (): Omit<Publication, 'id'> => ({ type: 'article', title: '', authors: '', year: new Date().getFullYear(), journal: '', volume: '', issue: '', pages: '', doi: '' })

const typeLabel: Record<PubType, string> = {
  book: 'Book',
  chapter: 'Book Chapter',
  article: 'Journal Article',
}

export default function PublicationsManager() {
  const { publications, addPublication, updatePublication, deletePublication } = useApp()
  const [activeType, setActiveType] = useState<PubType>('book')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Publication | null>(null)
  const [adding, setAdding] = useState<Omit<Publication, 'id'> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const filtered = useMemo(
    () => publications
      .filter(pub => pub.type === activeType)
      .filter(pub =>
        !search ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        pub.authors.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.year - a.year),
    [activeType, publications, search],
  )

  const counts = useMemo(
    () => ({
      book: publications.filter(pub => pub.type === 'book').length,
      chapter: publications.filter(pub => pub.type === 'chapter').length,
      article: publications.filter(pub => pub.type === 'article').length,
    }),
    [publications],
  )

  const createEmpty = (type: PubType): Omit<Publication, 'id'> =>
    type === 'book'
      ? emptyBook()
      : type === 'chapter'
      ? emptyChapter()
      : emptyArticle()

  const startAdd = () => {
    setAdding(createEmpty(activeType))
    setEditing(null)
  }

  const handleSaveNew = async () => {
    if (!adding) return
    await addPublication({ ...adding, id: crypto.randomUUID() } as Publication)
    setAdding(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    await updatePublication(editing)
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSelectType = (type: PubType) => {
    setActiveType(type)
    setSearch('')
    setAdding(null)
    setEditing(null)
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.35rem' }}>
            Scholarly Output
          </p>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1 }}>
            Publications
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: '#047857' }}>Saved ✓</span>}
          <button onClick={startAdd} className="btn-orange" style={{ border: 'none', cursor: 'pointer' }}>
            + Add {typeLabel[activeType]}
          </button>
        </div>
      </div>

      {adding && (
        <PublicationEditor
          publication={adding}
          mode="create"
          onChange={value => setAdding(prev => ({ ...prev, ...value } as Omit<Publication, 'id'>))}
          onSave={handleSaveNew}
          onCancel={() => setAdding(null)}
        />
      )}

      {editing && (
        <PublicationEditor
          publication={editing}
          mode="edit"
          onChange={value => setEditing(prev => (prev ? ({ ...prev, ...value }) : null))}
          onSave={handleSaveEdit}
          onCancel={() => setEditing(null)}
        />
      )}

      <PublicationList
        publications={filtered}
        activeType={activeType}
        counts={counts}
        search={search}
        onSearch={setSearch}
        onSelectType={handleSelectType}
        onEdit={pub => {
          setEditing(pub)
          setAdding(null)
          setActiveType(pub.type)
        }}
        onDelete={setDeleteId}
      />

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderTop: '3px solid #ef4444' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.75rem' }}>Delete Publication?</h3>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '2rem', lineHeight: 1.7 }}>
              Are you sure? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', border: '1.5px solid rgba(0,0,0,0.1)' }}>
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deletePublication(deleteId)
                  setDeleteId(null)
                }}
                style={{
                  flex: 1,
                  fontFamily: 'Inter',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '0.75rem',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
