import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { uploadFile, deleteFile } from '../../../utils/supabase/dataService'
import type { MediaFile } from '../../context/AppContext'

export default function MediaLibrary() {
  const { media, addMedia, deleteMedia } = useApp()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const filtered = media.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()))
  const fileToDelete = media.find(m => m.id === deleteId)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type and size on the client
        if (!ALLOWED_TYPES.includes(file.type)) {
          console.warn(`Rejected file "${file.name}": unsupported type ${file.type}`)
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`Rejected file "${file.name}": exceeds 5MB limit`)
          continue
        }

        const ext = file.name.split('.').pop() || 'jpg'
        const path = `${Date.now()}-${i}.${ext}`
        const url = await uploadFile(file, path)
        const newFile: MediaFile = {
          id: crypto.randomUUID(),
          url,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type,
          uploadedAt: new Date().toISOString().split('T')[0],
        }
        await addMedia(newFile)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000) })
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.35rem' }}>Assets</p>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1 }}>Media Library</h1>
        </div>
        <div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} style={{ display: 'none' }} />
          <button onClick={() => fileInput.current?.click()} disabled={uploading} className="btn-orange"
            style={{ border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? 'Uploading…' : '↑ Upload Images'}
          </button>
        </div>
      </div>

      {/* Constraints notice */}
      <div style={{ backgroundColor: 'rgba(212,80,40,0.06)', border: '1px solid rgba(212,80,40,0.15)', borderLeft: '3px solid var(--orange)', borderRadius: '12px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#666', margin: 0 }}>
          Accepted formats: <strong style={{ color: '#111' }}>JPG, PNG, WebP</strong> — Maximum file size: <strong style={{ color: '#111' }}>5 MB</strong> per image.
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <input type="text" placeholder="Search by filename…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ fontFamily: 'Inter', fontSize: '0.82rem', padding: '0.55rem 1.1rem', border: '1.5px solid rgba(0,0,0,0.1)', outline: 'none', minWidth: '260px', backgroundColor: '#fff', color: '#111', borderRadius: '100px', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
        <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 600, color: '#bbb' }}>{filtered.length} files</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.25rem', color: '#ddd' }}>
            {media.length === 0 ? 'No images yet' : 'No files match your search'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(file => (
            <div key={file.id} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}>
              <div style={{ position: 'relative', height: '140px', backgroundColor: '#f5f5f5' }}>
                <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.55)'
                    Array.from((e.currentTarget as HTMLElement).children).forEach(c => ((c as HTMLElement).style.opacity = '1'))
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0)'
                    Array.from((e.currentTarget as HTMLElement).children).forEach(c => ((c as HTMLElement).style.opacity = '0'))
                  }}>
                  <button onClick={() => copyUrl(file.url, file.id)}
                    style={{ opacity: 0, fontFamily: 'Inter', fontSize: '0.68rem', fontWeight: 700, padding: '0.4rem 0.9rem', borderRadius: '100px', backgroundColor: '#fff', color: '#111', border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                    {copied === file.id ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button onClick={() => setDeleteId(file.id)}
                    style={{ opacity: 0, fontFamily: 'Inter', fontSize: '0.68rem', fontWeight: 700, padding: '0.4rem 0.9rem', borderRadius: '100px', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{file.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#bbb' }}>{file.size}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#bbb' }}>{file.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderTop: '3px solid #ef4444' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.75rem' }}>Delete Image?</h3>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '2rem', lineHeight: 1.7 }}>
              Are you sure? "<strong style={{ color: '#111' }}>{fileToDelete?.name ?? 'this file'}</strong>" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', border: '1.5px solid rgba(0,0,0,0.1)' }}>Cancel</button>
              <button onClick={async () => {
                const file = fileToDelete
                if (file) {
                  // Try to delete from storage if it's a Supabase URL
                  try {
                    const url = new URL(file.url)
                    if (url.hostname.includes('supabase.co')) {
                      const path = url.pathname.split('/').pop()
                      if (path) await deleteFile(path)
                    }
                  } catch {}
                  await deleteMedia(deleteId)
                }
                setDeleteId(null)
              }}
                style={{ flex: 1, fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 700, padding: '0.75rem', borderRadius: '100px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
