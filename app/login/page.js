// app/login/page.js
// Login & Sign Up page — secured by Supabase Auth (email + password).
// createClient() connects to Supabase using our env variables.
// signUp creates a new account; signInWithPassword logs in an existing user.

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mountain } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  // mode: 'login' or 'signup' — toggles which form action runs
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')
  const [isError, setIsError]   = useState(false)

  const router = useRouter() // used to redirect after successful login

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsError(false)

    // Create a Supabase client instance (reads URL + key from .env.local)
    const supabase = createClient()

    if (mode === 'signup') {
      // Create a new account — Supabase will send a confirmation email
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        setMessage('✅ Account created! Check your email to confirm, then sign in.')
      }

    } else {
      // Sign in to an existing account
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        // Success — redirect to home dashboard
        router.push('/')
        router.refresh() // refresh so the navbar picks up the new session
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-stone-900 font-bold text-xl">
            <Mountain size={24} className="text-orange-500" /> TrailForge
          </div>
          <p className="text-stone-400 text-sm mt-1">Your Utah MTB companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-stone-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-stone-400 mb-6">
            {mode === 'login'
              ? 'Sign in to access your trails and bike.'
              : 'Start tracking your MTB journey.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Feedback message — green for success, red for error */}
            {message && (
              <div className={`text-xs rounded-lg p-3 ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <p className="text-center text-sm text-stone-400 mt-5">
            {mode === 'login' ? (
              <>No account?{' '}
                <button
                  onClick={() => { setMode('signup'); setMessage('') }}
                  className="text-orange-600 font-medium hover:underline"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setMessage('') }}
                  className="text-orange-600 font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          Secured by Supabase · Your data is private to you
        </p>
      </div>
    </div>
  )
}
