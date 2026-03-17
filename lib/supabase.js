// lib/supabase.js
// This file creates a connection to our Supabase database.
// We import this wherever we need to read/write data or handle login.

import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient sets up Supabase for use inside the browser (React components).
// It reads the URL and key from our .env.local file — never hardcoded here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
