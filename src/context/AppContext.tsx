import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  fetchPosts,
  fetchPublishedPosts,
  fetchPublications,
  fetchSettings,
  fetchMedia,
  fetchPostCount,
  fetchPublicationCount,
  fetchRecentPosts,
  createPost,
  updatePost as updatePostDb,
  deletePost as deletePostDb,
  createPublication,
  updatePublication as updatePublicationDb,
  deletePublication as deletePublicationDb,
  updateSettings as updateSettingsDb,
  createMedia,
  deleteMedia as deleteMediaDb,
  signIn,
  signOut,
  getSession,
  onAuthStateChange,
  subscribeToPosts,
  subscribeToPublications,
  subscribeToSettings,
  subscribeToMedia,
} from '../../utils/supabase/dataService'

export type Category =
  | 'Edupeace'
  | 'Books Review'
  | 'The Alma Mater'
  | 'Renaissance'
  | 'Give & Take'
  | 'Islam'

export interface Post {
  id: string
  title: string
  slug: string
  category: Category
  publishDate: string
  excerpt: string
  content: string
  featuredImage?: string
  status: 'draft' | 'published'
  author: string
}

export interface Publication {
  id: string
  type: 'book' | 'chapter' | 'article'
  title: string
  authors: string
  year: number
  publisher?: string
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  editors?: string
  isbn?: string
  doi?: string
  url?: string
}

export interface Settings {
  bio: string
  email: string
  phone: string
  institution: string
  twitter: string
  linkedin: string
  researchgate: string
  academia: string
  facebook: string
  googleScholar: string
}

export interface MediaFile {
  id: string
  url: string
  name: string
  size: string
  type: string
  uploadedAt: string
}

const defaultSettings: Settings = {
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

interface AppContextType {
  posts: Post[]
  publications: Publication[]
  settings: Settings
  media: MediaFile[]
  isAdminLoggedIn: boolean
  sessionExpired: boolean
  recentActivity: string[]
  loading: boolean
  error: string | null
  postCount: number
  publicationCount: number
  recentPosts: Post[]
  addPost: (post: Post) => Promise<void>
  updatePost: (post: Post) => Promise<void>
  deletePost: (id: string) => Promise<void>
  addPublication: (pub: Publication) => Promise<void>
  updatePublication: (pub: Publication) => Promise<void>
  deletePublication: (id: string) => Promise<void>
  updateSettings: (s: Settings) => Promise<void>
  addMedia: (file: MediaFile) => Promise<void>
  deleteMedia: (id: string) => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearSessionExpiry: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [media, setMedia] = useState<MediaFile[]>([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [postCount, setPostCount] = useState(0)
  const [publicationCount, setPublicationCount] = useState(0)
  const [recentPosts, setRecentPosts] = useState<Post[]>([])

  const logActivity = useCallback((msg: string) => {
    setRecentActivity(prev => [msg, ...prev].slice(0, 20))
  }, [])

  // ── LOAD DATA ──
  // Admins get ALL posts (drafts + published) so counts and lists are
  // accurate; anonymous/public users only get published posts.
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isAdminLoggedIn) {
        const [postsRes, countRes, pubsRes, pubCountRes, recentRes, settingsRes, mediaRes] =
          await Promise.allSettled([
            fetchPosts(),
            fetchPostCount(),
            fetchPublications(),
            fetchPublicationCount(),
            fetchRecentPosts(5),
            fetchSettings(),
            fetchMedia(),
          ])

        if (postsRes.status === 'fulfilled') setPosts(postsRes.value)
        if (countRes.status === 'fulfilled') setPostCount(countRes.value)
        if (pubsRes.status === 'fulfilled') setPublications(pubsRes.value)
        if (pubCountRes.status === 'fulfilled') setPublicationCount(pubCountRes.value)
        if (recentRes.status === 'fulfilled') setRecentPosts(recentRes.value)
        if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value)
        if (mediaRes.status === 'fulfilled') setMedia(mediaRes.value)

        const failures: Record<string, PromiseRejectedResult> = {
          ...(postsRes.status === 'rejected' ? { 'essays list': postsRes } : {}),
          ...(countRes.status === 'rejected' ? { 'essay count': countRes } : {}),
          ...(pubsRes.status === 'rejected' ? { 'publications list': pubsRes } : {}),
          ...(pubCountRes.status === 'rejected' ? { 'publication count': pubCountRes } : {}),
          ...(recentRes.status === 'rejected' ? { 'recent essays': recentRes } : {}),
          ...(settingsRes.status === 'rejected' ? { settings: settingsRes } : {}),
          ...(mediaRes.status === 'rejected' ? { media: mediaRes } : {}),
        }

        if (Object.keys(failures).length > 0) {
          const detail = Object.entries(failures)
            .map(([label, r]) => `${label}: ${(r.reason as Error)?.message ?? 'unknown error'}`)
            .join(' | ')
          setError(`Could not load some dashboard data from Supabase — ${detail}`)
        }
      } else {
        const [postsRes, pubsRes, settingsRes, mediaRes] = await Promise.allSettled([
          fetchPublishedPosts(),
          fetchPublications(),
          fetchSettings(),
          fetchMedia(),
        ])

        if (postsRes.status === 'fulfilled') {
          setPosts(postsRes.value)
          setPostCount(postsRes.value.length)
          setRecentPosts(postsRes.value.slice(0, 5))
        }
        if (pubsRes.status === 'fulfilled') {
          setPublications(pubsRes.value)
          setPublicationCount(pubsRes.value.length)
        }
        if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value)
        if (mediaRes.status === 'fulfilled') setMedia(mediaRes.value)

        const failures: Record<string, PromiseRejectedResult> = {
          ...(postsRes.status === 'rejected' ? { 'essays list': postsRes } : {}),
          ...(pubsRes.status === 'rejected' ? { 'publications list': pubsRes } : {}),
          ...(settingsRes.status === 'rejected' ? { settings: settingsRes } : {}),
          ...(mediaRes.status === 'rejected' ? { media: mediaRes } : {}),
        }

        if (Object.keys(failures).length > 0) {
          const detail = Object.entries(failures)
            .map(([label, r]) => `${label}: ${(r.reason as Error)?.message ?? 'unknown error'}`)
            .join(' | ')
          setError(`Could not load some data from Supabase — ${detail}`)
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err)
      setError((err as Error)?.message ?? 'Failed to load data from Supabase. Check your connection and permissions.')
    } finally {
      setLoading(false)
    }
  }, [isAdminLoggedIn])

  // ── AUTH STATE (drives whether admin data is loaded) ──
  useEffect(() => {
    let mounted = true

    getSession().then(session => {
      if (mounted) setIsAdminLoggedIn(!!session)
    })

    const { data: authListener } = onAuthStateChange(session => {
      if (mounted) setIsAdminLoggedIn(!!session)
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  // ── INITIAL LOAD (re-runs when auth state flips) ──
  useEffect(() => {
    loadAll()
  }, [loadAll])

  // ── REALTIME SUBSCRIPTIONS ──
  useEffect(() => {
    const postsChannel = subscribeToPosts(payload => {
      if (payload.eventType === 'INSERT') {
        const post = payload.new as Post
        setPosts(prev => [post, ...prev])
        setPostCount(c => c + 1)
        setRecentPosts(prev => [post, ...prev].slice(0, 5))
        logActivity(`New post added: "${post.title}"`)
      } else if (payload.eventType === 'UPDATE') {
        const post = payload.new as Post
        setPosts(prev => prev.map(p => (p.id === post.id ? post : p)))
        setRecentPosts(prev => prev.map(p => (p.id === post.id ? post : p)))
        logActivity(`Updated post: "${post.title}"`)
      } else if (payload.eventType === 'DELETE') {
        const old = payload.old as Post
        setPosts(prev => prev.filter(p => p.id !== old.id))
        setPostCount(c => Math.max(0, c - 1))
        setRecentPosts(prev => prev.filter(p => p.id !== old.id))
        logActivity('Deleted a post')
      }
    })

    const pubsChannel = subscribeToPublications(payload => {
      if (payload.eventType === 'INSERT') {
        setPublications(prev => [payload.new as Publication, ...prev])
        setPublicationCount(c => c + 1)
        logActivity(`Added publication: "${(payload.new as Publication).title}"`)
      } else if (payload.eventType === 'UPDATE') {
        setPublications(prev => prev.map(p => (p.id === payload.new.id ? (payload.new as Publication) : p)))
        logActivity(`Updated publication: "${(payload.new as Publication).title}"`)
      } else if (payload.eventType === 'DELETE') {
        setPublications(prev => prev.filter(p => p.id !== payload.old.id))
        setPublicationCount(c => Math.max(0, c - 1))
        logActivity('Deleted a publication')
      }
    })

    const settingsChannel = subscribeToSettings(payload => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        setSettings(payload.new as Settings)
        logActivity('Updated site settings')
      }
    })

    const mediaChannel = subscribeToMedia(payload => {
      if (payload.eventType === 'INSERT') {
        setMedia(prev => [payload.new as MediaFile, ...prev])
        logActivity(`Uploaded media: ${(payload.new as MediaFile).name}`)
      } else if (payload.eventType === 'DELETE') {
        setMedia(prev => prev.filter(m => m.id !== payload.old.id))
        logActivity('Deleted media file')
      }
    })

    return () => {
      postsChannel.unsubscribe()
      pubsChannel.unsubscribe()
      settingsChannel.unsubscribe()
      mediaChannel.unsubscribe()
    }
  }, [logActivity])

  // ── CRUD OPERATIONS ──
  const addPost = async (post: Post) => {
    const saved = await createPost(post)
    setPosts(prev => [saved, ...prev])
    setPostCount(c => c + 1)
    setRecentPosts(prev => [saved, ...prev].slice(0, 5))
    logActivity(`${saved.status === 'published' ? 'Published' : 'Drafted'}: "${saved.title}"`)
  }

  const updatePost = async (post: Post) => {
    const saved = await updatePostDb(post)
    setPosts(prev => prev.map(p => (p.id === saved.id ? saved : p)))
    setRecentPosts(prev => prev.map(p => (p.id === saved.id ? saved : p)))
    logActivity(`Updated: "${saved.title}"`)
  }

  const deletePost = async (id: string) => {
    const post = posts.find(p => p.id === id)
    await deletePostDb(id)
    setPosts(prev => prev.filter(p => p.id !== id))
    setPostCount(c => Math.max(0, c - 1))
    setRecentPosts(prev => prev.filter(p => p.id !== id))
    if (post) logActivity(`Deleted post: "${post.title}"`)
  }

  const addPublication = async (pub: Publication) => {
    const saved = await createPublication(pub)
    setPublications(prev => [saved, ...prev])
    setPublicationCount(c => c + 1)
    logActivity(`Added publication: "${saved.title}"`)
  }

  const updatePublication = async (pub: Publication) => {
    const saved = await updatePublicationDb(pub)
    setPublications(prev => prev.map(p => (p.id === saved.id ? saved : p)))
    logActivity(`Updated publication: "${saved.title}"`)
  }

  const deletePublication = async (id: string) => {
    const pub = publications.find(p => p.id === id)
    await deletePublicationDb(id)
    setPublications(prev => prev.filter(p => p.id !== id))
    setPublicationCount(c => Math.max(0, c - 1))
    if (pub) logActivity(`Deleted publication: "${pub.title}"`)
  }

  const updateSettings = async (s: Settings) => {
    const saved = await updateSettingsDb(s)
    setSettings(saved)
    logActivity('Updated site settings')
  }

  const addMedia = async (file: MediaFile) => {
    const saved = await createMedia(file)
    setMedia(prev => [saved, ...prev])
    logActivity(`Uploaded media: ${saved.name}`)
  }

  const deleteMedia = async (id: string) => {
    const file = media.find(m => m.id === id)
    await deleteMediaDb(id)
    setMedia(prev => prev.filter(m => m.id !== id))
    if (file) logActivity(`Deleted media: ${file.name}`)
  }

  // ── AUTH ──
  const login = async (email: string, password: string) => {
    const success = await signIn(email, password)
    if (success) {
      setIsAdminLoggedIn(true)
      setSessionExpired(false)
    }
    return success
  }

  const logout = async () => {
    await signOut()
    setIsAdminLoggedIn(false)
    setSessionExpired(false)
  }

  const clearSessionExpiry = () => setSessionExpired(false)

  return (
    <AppContext.Provider
      value={{
        posts, publications, settings, media,
        isAdminLoggedIn, sessionExpired, recentActivity, loading, error,
        postCount, publicationCount, recentPosts,
        addPost, updatePost, deletePost,
        addPublication, updatePublication, deletePublication,
        updateSettings, addMedia, deleteMedia,
        login, logout, clearSessionExpiry,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}