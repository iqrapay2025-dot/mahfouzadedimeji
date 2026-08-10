import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { postgresChangesFilter } from '@supabase/realtime-js'
import { fetchPublishedPublications } from '../../utils/supabase/dataService'
import type { Publication } from '../context/AppContext'

export default function usePublications() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadPublications() {
      setLoading(true)
      try {
        const publishedPublications = await fetchPublishedPublications()
        if (mounted) setPublications(publishedPublications)
      } catch (err) {
        if (mounted) setError((err as Error)?.message ?? 'Unable to load publications')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadPublications()

    const channel = supabase
      .channel('publications-published')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'publications', filter: postgresChangesFilter() },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setPublications(prev => [payload.new as Publication, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setPublications(prev => prev.map(pub => (pub.id === payload.new.id ? (payload.new as Publication) : pub)))
          } else if (payload.eventType === 'DELETE') {
            setPublications(prev => prev.filter(pub => pub.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [])

  return { publications, loading, error }
}
