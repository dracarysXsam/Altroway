import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Create a single Supabase client for the client-side
  // to prevent multiple instances from being created.
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
