import fetch from 'node-fetch'

// Usage: SUPABASE_URL=https://xyz.supabase.co ANON_KEY=ey... node scripts/rls_test.js
const SUPABASE_URL = process.env.SUPABASE_URL
const ANON_KEY = process.env.ANON_KEY
if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Please set SUPABASE_URL and ANON_KEY environment variables')
  process.exit(2)
}

const api = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1`

async function attemptInsert(resource, body) {
  const res = await fetch(`${api}/${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  console.log(`POST /${resource} -> status ${res.status}`)
  if (text) console.log('response body:', text)
}

;(async () => {
  await attemptInsert('posts', { title: 'RLS test', category: 'Edupeace', excerpt: 'test', content: 'rls test', status: 'draft', author: 'rls' })
  await attemptInsert('publications', { type: 'book', title: 'RLS test', authors: 'Tester', year: 2026 })
})().catch(err => { console.error(err); process.exit(1) })
