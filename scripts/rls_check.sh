#!/usr/bin/env bash
# Quick RLS sanity checks using curl. Set SUPABASE_URL and ANON_KEY in environment.
# Example: SUPABASE_URL=https://xyz.supabase.co ANON_KEY=ey... ./scripts/rls_check.sh

set -euo pipefail

if [ -z "${SUPABASE_URL+x}" ] || [ -z "${ANON_KEY+x}" ]; then
  echo "ERROR: Please set SUPABASE_URL and ANON_KEY environment variables."
  exit 2
fi

API="$SUPABASE_URL/rest/v1"

echo "Attempting anonymous INSERT into posts (should be blocked by RLS)..."
HTTP=$(curl -s -o /dev/stderr -w "%{http_code}" -X POST "$API/posts" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"RLS test","category":"Edupeace","excerpt":"test","content":"rls test","status":"draft","author":"rls"}')

echo "HTTP status: $HTTP"

echo "Attempting anonymous INSERT into publications (should be blocked by RLS)..."
HTTP2=$(curl -s -o /dev/stderr -w "%{http_code}" -X POST "$API/publications" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"book","title":"RLS test","authors":"Tester","year":2026}')

echo "HTTP status: $HTTP2"

echo "If either request returns 201, RLS is not blocking anon inserts. Expected 401/403/422 depending on policy."