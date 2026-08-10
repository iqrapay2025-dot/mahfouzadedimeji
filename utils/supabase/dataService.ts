import { supabase } from './client'
import type { Post, Publication, Settings, MediaFile } from '@/context/AppContext'

// ── TYPE MAPPERS ──

interface PostRow {
  id: string
  title: string
  slug: string
  category: string
  publish_date: string
  excerpt: string
  content: string
  featured_image: string | null
  status: 'draft' | 'published'
  author: string
  created_at: string
  updated_at: string
}

interface PublicationRow {
  id: string
  type: 'book' | 'chapter' | 'journal_article'
  title: string
  authors: string
  year: number | null
  publisher: string | null
  journal_name: string | null
  volume: string | null
  issue: string | null
  pages: string | null
  editors: string | null
  isbn: string | null
  doi: string | null
  url: string | null
  created_at: string
  updated_at: string
}

interface SettingsRow {
  id: number
  bio: string
  contact_email: string
  social_links: Record<string, string>
  phone: string
  institution: string
  updated_at: string
}

interface MediaRow {
  id: string
  url: string
  name: string
  size: string
  type: string
  uploaded_at: string
}

const mapPostRow = (row: PostRow): Post => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  category: row.category as Post['category'],
  publishDate: row.publish_date,
  excerpt: row.excerpt,
  content: row.content,
  featuredImage: row.featured_image ?? undefined,
  status: row.status,
  author: row.author,
})

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const mapPostToRow = (post: Post): Partial<PostRow> => ({
  title: post.title,
  slug: post.slug ? toSlug(post.slug) : toSlug(post.title),
  category: post.category,
  publish_date: post.publishDate,
  excerpt: post.excerpt,
  content: post.content,
  featured_image: post.featuredImage ?? null,
  status: post.status,
  author: post.author,
})

const mapPublicationRow = (row: PublicationRow): Publication => ({
  id: row.id,
  type: row.type === 'journal_article' ? 'article' : row.type,
  title: row.title,
  authors: row.authors,
  year: row.year ?? 0,
  publisher: row.publisher ?? undefined,
  journal: row.journal_name ?? undefined,
  volume: row.volume ?? undefined,
  issue: row.issue ?? undefined,
  pages: row.pages ?? undefined,
  editors: row.editors ?? undefined,
  isbn: row.isbn ?? undefined,
  doi: row.doi ?? undefined,
  url: row.url ?? undefined,
})

const mapPublicationToRow = (pub: Publication): Partial<PublicationRow> => ({
  type: pub.type === 'article' ? 'journal_article' : pub.type,
  title: pub.title,
  authors: pub.authors,
  year: pub.year || null,
  publisher: pub.publisher ?? null,
  journal_name: pub.journal ?? null,
  volume: pub.volume ?? null,
  issue: pub.issue ?? null,
  pages: pub.pages ?? null,
  editors: pub.editors ?? null,
  isbn: pub.isbn ?? null,
  doi: pub.doi ?? null,
  url: pub.url ?? null,
})

const mapSettingsRow = (row: SettingsRow): Settings => ({
  bio: row.bio,
  email: row.contact_email,
  phone: row.phone,
  institution: row.institution,
  twitter: row.social_links?.twitter ?? '',
  linkedin: row.social_links?.linkedin ?? '',
  researchgate: row.social_links?.researchgate ?? '',
  academia: row.social_links?.academia ?? '',
  facebook: row.social_links?.facebook ?? '',
  googleScholar: row.social_links?.googleScholar ?? '',
})

const mapSettingsToRow = (s: Settings): Partial<SettingsRow> => ({
  bio: s.bio,
  contact_email: s.email,
  phone: s.phone,
  institution: s.institution,
  social_links: {
    twitter: s.twitter,
    linkedin: s.linkedin,
    researchgate: s.researchgate,
    academia: s.academia,
    facebook: s.facebook,
    googleScholar: s.googleScholar,
  },
})

const mapMediaRow = (row: MediaRow): MediaFile => ({
  id: row.id,
  url: row.url,
  name: row.name,
  size: row.size,
  type: row.type,
  uploadedAt: row.uploaded_at,
})

// ── POSTS ──

// Admin: fetch all posts (including drafts) with pagination
export async function fetchPosts(options?: { limit?: number; offset?: number }): Promise<Post[]> {
  const limit = options?.limit ?? 100
  const offset = options?.offset ?? 0
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('publish_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as PostRow[]).map(mapPostRow)
}

// Admin: real count of ALL posts (drafts + published)
export async function fetchPostCount(): Promise<number> {
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

// Admin: most recent essays (all statuses), ordered by created_at desc
export async function fetchRecentPosts(limit = 5): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as PostRow[]).map(mapPostRow)
}

// Public: fetch only published posts with pagination
export async function fetchPublishedPosts(options?: { limit?: number; offset?: number }): Promise<Post[]> {
  const limit = options?.limit ?? 100
  const offset = options?.offset ?? 0
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('publish_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return (data as PostRow[]).map(mapPostRow)
}

export async function createPost(post: Post): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(mapPostToRow(post))
    .select()
    .single()

  if (error) throw error
  return mapPostRow(data as PostRow)
}

export async function updatePost(post: Post): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .update(mapPostToRow(post))
    .eq('id', post.id)
    .select()
    .single()

  if (error) throw error
  return mapPostRow(data as PostRow)
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── PUBLICATIONS ──

export async function fetchPublications(): Promise<Publication[]> {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })

  if (error) throw error
  return (data as PublicationRow[]).map(mapPublicationRow)
}

// Admin: real count of ALL publications
export async function fetchPublicationCount(): Promise<number> {
  const { count, error } = await supabase
    .from('publications')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function fetchPublishedPublications(): Promise<Publication[]> {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })

  if (error) throw error
  return (data as PublicationRow[]).map(mapPublicationRow)
}

export async function createPublication(pub: Publication): Promise<Publication> {
  const { data, error } = await supabase
    .from('publications')
    .insert(mapPublicationToRow(pub))
    .select()
    .single()

  if (error) throw error
  return mapPublicationRow(data as PublicationRow)
}

export async function updatePublication(pub: Publication): Promise<Publication> {
  const { data, error } = await supabase
    .from('publications')
    .update(mapPublicationToRow(pub))
    .eq('id', pub.id)
    .select()
    .single()

  if (error) throw error
  return mapPublicationRow(data as PublicationRow)
}

export async function deletePublication(id: string): Promise<void> {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── SETTINGS ──

export async function fetchSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  // A missing settings row (PGRST116) is not a real failure — return defaults
  // so the rest of the dashboard data still loads.
  if (error) throw error
  if (!data) {
    return {
      bio: '',
      email: '',
      phone: '',
      institution: '',
      twitter: '',
      linkedin: '',
      researchgate: '',
      academia: '',
      facebook: '',
      googleScholar: '',
    }
  }
  return mapSettingsRow(data as SettingsRow)
}

export async function updateSettings(s: Settings): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .update(mapSettingsToRow(s))
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return mapSettingsRow(data as SettingsRow)
}

// ── MEDIA ──

export async function fetchMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return (data as MediaRow[]).map(mapMediaRow)
}

export async function createMedia(file: MediaFile): Promise<MediaFile> {
  const { data, error } = await supabase
    .from('media')
    .insert({
      url: file.url,
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded_at: file.uploadedAt,
    })
    .select()
    .single()

  if (error) throw error
  return mapMediaRow(data as MediaRow)
}

export async function deleteMedia(id: string): Promise<void> {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── STORAGE ──

export async function uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const publicUrlResponse = await supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  if (!publicUrlResponse?.data?.publicUrl) throw new Error('Failed to get public URL')

  return publicUrlResponse.data.publicUrl
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('media')
    .remove([path])

  if (error) throw error
}

export async function uploadPostImage(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const publicUrlResponse = await supabase.storage
    .from('post-images')
    .getPublicUrl(data.path)

  if (!publicUrlResponse?.data?.publicUrl) throw new Error('Failed to get public URL')

  return publicUrlResponse.data.publicUrl
}

// ── AUTH ──

export async function signIn(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return false
  return true
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// ── REALTIME ──

export function subscribeToPosts(callback: (payload: any) => void) {
  return supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      callback
    )
    .subscribe()
}

export function subscribeToPublications(callback: (payload: any) => void) {
  return supabase
    .channel('publications-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'publications' },
      callback
    )
    .subscribe()
}

export function subscribeToSettings(callback: (payload: any) => void) {
  return supabase
    .channel('settings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      callback
    )
    .subscribe()
}

export function subscribeToMedia(callback: (payload: any) => void) {
  return supabase
    .channel('media-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'media' },
      callback
    )
    .subscribe()
}

// ── CONTACT MESSAGES ──

export async function submitContactMessage(message: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .insert(message)

  if (error) throw error
}

export async function fetchContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function markMessageRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id)

  if (error) throw error
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}