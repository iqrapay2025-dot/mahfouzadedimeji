import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useApp } from '../../context/AppContext'
import { uploadPostImage } from '../../../utils/supabase/dataService'
import type { Category, Post } from '../../context/AppContext'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const CATEGORIES: Category[] = ['Edupeace', 'Books Review', 'The Alma Mater', 'Renaissance', 'Give & Take', 'Islam']
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { posts, addPost, updatePost, deletePost } = useApp()
  const isNew = id === 'new'
  const existing = isNew ? null : posts.find(p => p.id === id)

  const [title, setTitle] = useState(existing?.title ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(false)
  const [category, setCategory] = useState<Category>(existing?.category ?? 'Edupeace')
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? '')
  const [featuredImage, setFeaturedImage] = useState(existing?.featuredImage ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(existing?.status ?? 'draft')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPublishedBanner, setShowPublishedBanner] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: existing?.content ?? '',
    onUpdate: ({ editor }) => {
      setPreviewContent(editor.getHTML())
    },
  })

  const [previewContent, setPreviewContent] = useState(existing?.content ?? '')

  useEffect(() => {
    if (!isNew && !existing) navigate('/admin/posts')
  }, [existing, isNew, navigate])

  useEffect(() => {
    if (!isNew && existing) {
      setTitle(existing.title)
      setSlug(existing.slug)
      setCategory(existing.category)
      setExcerpt(existing.excerpt)
      setFeaturedImage(existing.featuredImage ?? '')
      setStatus(existing.status)
      setPreviewContent(existing.content)
      editor?.commands.setContent(existing.content)
    }
  }, [existing, isNew, editor])

  useEffect(() => {
    if (!slugEdited) {
      setSlug(toSlug(title || ''))
    }
  }, [title, slugEdited])

  const save = async (newStatus?: 'draft' | 'published') => {
    const finalStatus = newStatus ?? status
    // Client-side validation
    const textContent = (editor?.state?.doc?.textContent as string) ?? (previewContent || '')
    const nextErrors: Record<string, string> = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!textContent.trim() || textContent.trim().length < 20) nextErrors.body = 'Body is required (min 20 characters).'
    if (excerpt && excerpt.length > 300) nextErrors.excerpt = 'Excerpt must be 300 characters or less.'
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) nextErrors.slug = 'Slug contains invalid characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2500)
      return
    }
    setSaveState('saving')
    const htmlContent = editor?.getHTML() ?? previewContent
    const post: Post = {
      id: existing?.id ?? crypto.randomUUID(),
      title: title || 'Untitled',
      slug: slug || toSlug(title),
      category,
      publishDate: existing?.publishDate ?? new Date().toISOString().split('T')[0],
      excerpt,
      content: htmlContent,
      featuredImage: featuredImage || undefined,
      status: finalStatus,
      author: 'Prof. Mahfouz A. Adedimeji',
    }

    try {
      if (isNew) {
        await addPost(post)
        navigate(`/admin/posts/${post.id}`, { replace: true })
      } else {
        await updatePost(post)
      }
      setStatus(finalStatus)
      setSaveState('saved')
      if (finalStatus === 'published') setShowPublishedBanner(true)
      setTimeout(() => setSaveState('idle'), 2500)
    } catch (err) {
      console.error('Failed to save post:', err)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2500)
    }
  }

  const handleDelete = async () => {
    if (existing) {
      await deletePost(existing.id)
      navigate('/admin/posts')
    }
  }

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  const handleImageFile = async (file: File) => {
    setUploadError('')

    // Validate file type and size on the client
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Unsupported file type. Please use JPG, PNG, or WebP.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError('Image exceeds 5MB limit. Please choose a smaller file.')
      return
    }

    setUploadingImage(true)
    try {
      // Sanitize the filename - remove spaces and special characters
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
      // Path is relative to the bucket - do NOT prefix with bucket name again
      const publicUrl = await uploadPostImage(file, `${crypto.randomUUID()}-${safeName}`)
      setFeaturedImage(publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      // Show the actual error message to help debug
      const message = (error as Error)?.message ?? ''
      setUploadError(message.includes('Bucket not found')
        ? 'Storage bucket not configured. Please run the latest migration.'
        : `Image upload failed: ${message || 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', fontFamily: 'Inter', fontSize: '0.875rem', padding: '0.75rem 1rem',
    border: '1.5px solid rgba(0,0,0,0.1)', color: '#111', outline: 'none',
    backgroundColor: '#fafafa', transition: 'border-color 0.2s', borderRadius: '12px', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: '0.5rem' }

  const editorMenu = useMemo(() => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
      {[
        { label: 'Bold', action: () => editor?.chain().focus().toggleBold().run() },
        { label: 'Italic', action: () => editor?.chain().focus().toggleItalic().run() },
        { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: 'Bullet List', action: () => editor?.chain().focus().toggleBulletList().run() },
      ].map(tool => (
        <button key={tool.label} type="button" onClick={tool.action}
          style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 700, padding: '0.45rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9', cursor: 'pointer', color: '#555' }}>
          {tool.label}
        </button>
      ))}
    </div>
  ), [editor])

  return (
    <>
      {showPublishedBanner && (
        <div style={{ backgroundColor: 'rgba(212,80,40,0.08)', borderBottom: '1px solid rgba(212,80,40,0.15)', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 700, color: 'var(--orange)' }}>
            ✓ Published — now live on the public site.
          </span>
          <button onClick={() => setShowPublishedBanner(false)} style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link to="/admin/posts" style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, color: '#bbb', textDecoration: 'none' }}>
            ← Essays
          </Link>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '2rem', color: '#111', lineHeight: 1, flex: 1 }}>
            {isNew ? 'New Essay' : 'Edit Essay'}
          </h1>
          {saveState !== 'idle' && (
            <span style={{ fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, color: saveState === 'saved' ? '#047857' : 'var(--orange)' }}>
              {saveState === 'saving' ? 'Saving…' : 'Saved ✓'}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <label style={lbl}>Title *</label>
              <input type="text" placeholder="Enter essay title…" value={title} onChange={e => setTitle(e.target.value)}
                style={{ ...inp, fontWeight: 700, fontSize: '1rem', backgroundColor: '#fff' }}
                onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
              {errors.title && (
                <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.5rem' }}>{errors.title}</p>
              )}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <label style={lbl}>Slug</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                <input type="text" value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
                  style={{ ...inp, fontSize: '0.88rem', backgroundColor: '#fff' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
                {errors.slug && (
                  <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.5rem' }}>{errors.slug}</p>
                )}
                <button type="button" onClick={() => { setSlug(toSlug(title)); setSlugEdited(true) }}
                  style={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 700, borderRadius: '12px', backgroundColor: 'var(--orange)', color: '#fff', border: 'none', cursor: 'pointer', padding: '0 1rem' }}>
                  Regenerate
                </button>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginTop: '0.75rem' }}>This is the URL-friendly slug stored with the post.</p>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <label style={lbl}>Excerpt <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#ccc' }}>(shown in listings)</span></label>
              <textarea rows={3} placeholder="A short summary…" value={excerpt} onChange={e => setExcerpt(e.target.value)}
                style={{ ...inp, resize: 'vertical', backgroundColor: '#fff' }}
                onFocus={e => (e.target.style.borderColor = 'var(--orange)')} onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')} />
              {errors.excerpt && (
                <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.5rem' }}>{errors.excerpt}</p>
              )}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <label style={lbl}>Body *</label>
              {editorMenu}
              <div style={{ border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '18px', backgroundColor: '#fff', minHeight: '420px' }}>
                <EditorContent editor={editor} />
              </div>
              {errors.body && (
                <p style={{ color: '#b91c1c', fontFamily: 'Inter', fontSize: '0.82rem', marginTop: '0.5rem' }}>{errors.body}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={lbl}>Publish</h3>
              <label style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#111', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
                <input type="checkbox" checked={status === 'published'} onChange={e => setStatus(e.target.checked ? 'published' : 'draft')} style={{ accentColor: 'var(--orange)', width: '15px', height: '15px' }} />
                <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>Publicly visible</span>
              </label>
              <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#bbb', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {status === 'published' ? 'Live on public site' : 'Draft — not visible'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={() => save('published')} disabled={saveState === 'saving'} className="btn-orange"
                  style={{ justifyContent: 'center', border: 'none', cursor: saveState === 'saving' ? 'not-allowed' : 'pointer', opacity: saveState === 'saving' ? 0.7 : 1, width: '100%' }}>
                  Publish
                </button>
                <button onClick={() => save('draft')} disabled={saveState === 'saving'}
                  style={{ fontFamily: 'Inter', fontSize: '0.82rem', fontWeight: 700, padding: '0.7rem', borderRadius: '100px', backgroundColor: 'transparent', color: '#999', border: '1.5px solid rgba(0,0,0,0.1)', cursor: 'pointer', width: '100%' }}>
                  Save Draft
                </button>
              </div>
              {!isNew && (
                <button onClick={() => setShowDeleteModal(true)}
                  style={{ marginTop: '0.75rem', width: '100%', fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 700, padding: '0.55rem', borderRadius: '100px', backgroundColor: 'transparent', color: '#f87171', border: '1.5px solid rgba(239,68,68,0.2)', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                  Delete Essay
                </button>
              )}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={lbl}>Category</h3>
              <select value={category} onChange={e => setCategory(e.target.value as Category)}
                style={{ width: '100%', fontFamily: 'Inter', fontSize: '0.85rem', padding: '0.7rem 1rem', border: '1.5px solid rgba(0,0,0,0.1)', color: '#111', backgroundColor: '#fafafa', cursor: 'pointer', outline: 'none', borderRadius: '12px' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={lbl}>Featured Image</h3>
              {featuredImage && (
                <div style={{ marginBottom: '0.75rem', position: 'relative', overflow: 'hidden', borderRadius: '10px' }}>
                  <img src={featuredImage} alt="Featured" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => setFeaturedImage('')}
                    style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', fontSize: '0.7rem' }}>✕</button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                style={{ width: '100%', fontFamily: 'Inter', fontSize: '0.85rem', marginBottom: '0.75rem' }} />
              {uploadingImage && <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#666' }}>Uploading image…</p>}
              {uploadError && <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#ef4444' }}>{uploadError}</p>}
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#ccc', marginTop: '0.4rem' }}>JPG / PNG / WebP · max 5 MB</p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderTop: '3px solid #ef4444' }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '0.75rem' }}>Delete Essay?</h3>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#777', marginBottom: '2rem', lineHeight: 1.7 }}>
              Are you sure? "<strong style={{ color: '#111' }}>{title || 'this essay'}</strong>" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', border: '1.5px solid rgba(0,0,0,0.1)' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 700, padding: '0.75rem', borderRadius: '100px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
