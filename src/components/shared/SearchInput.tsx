'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchInput({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Sync from URL only when the user isn't actively typing
  useEffect(() => {
    if (!focused) setQuery(initialQuery)
  }, [initialQuery, focused])

  // Auto-redirect 600 ms after the user stops typing (min 2 chars)
  useEffect(() => {
    const q = query.trim()
    if (!focused || q.length < 2) return
    const timer = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
    }, 600)
    return () => clearTimeout(timer)
  }, [query, focused, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
  }

  const clear = () => {
    setQuery('')
    router.push('/search', { scroll: false })
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-2xl">
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${focused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        <Search size={18} className="shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search articles, blog posts, insights..."
          autoFocus
          className="flex-1 bg-transparent outline-none"
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            caretColor: 'oklch(0.82 0.15 75)',
          }}
        />
        {/* Pulsing dot while debounce is running */}
        {focused && query.trim().length >= 2 && (
          <span
            className="shrink-0 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'oklch(0.82 0.15 75)' }}
          />
        )}
        {query && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 p-1 transition-opacity hover:opacity-60"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  )
}
