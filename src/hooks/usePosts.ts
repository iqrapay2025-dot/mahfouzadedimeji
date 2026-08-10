import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { postgresChangesFilter } from '@supabase/realtime-js'
import { fetchPublishedPosts } from '../../utils/supabase/dataService'
import type { Post } from '../context/AppContext'

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadPosts() {
      setLoading(true)
      try {
        const publishedPosts = await fetchPublishedPosts()
        if (mounted) setPosts(publishedPosts)
      } catch (err) {
        if (mounted) setError((err as Error)?.message ?? 'Unable to load posts')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadPosts()

    const channel = supabase
      .channel('posts-published')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: postgresChangesFilter().eq('status', 'published') },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as Post, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => prev.map(post => (post.id === payload.new.id ? (payload.new as Post) : post)))
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(post => post.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [])

  return { posts, loading, error }
}
