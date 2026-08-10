import { readFileSync } from 'node:fs'

const env = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .filter(l => l && !l.trim().startsWith('#'))
  .reduce((acc, line) => {
    const [k, ...rest] = line.split('=')
    if (k) acc[k.trim()] = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
    return acc
  }, {})

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(2)
}

const api = `${url.replace(/\/+$/, '')}/rest/v1`

async function count(resource, filter = '') {
  const res = await fetch(`${api}/${resource}?select=id${filter}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  })
  const contentRange = res.headers.get('content-range') || ''
  const match = contentRange.match(/\/(\d+)$/)
  return match ? Number(match[1]) : null
}

const postsAll = await count('posts')
const postsPublished = await count('posts', '&status=eq.published')
const pubs = await count('publications')

console.log('Real Supabase counts (anon role):')
console.log(`  posts (all):       ${postsAll ?? 'N/A'}`)
console.log(`  posts (published): ${postsPublished ?? 'N/A'}`)
console.log(`  publications:      ${pubs ?? 'N/A'}`)