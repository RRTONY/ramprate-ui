'use client'

import {useState, useEffect, useRef, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import {Search, X, Send, Loader2, Sparkles, ArrowRight, Globe, BookOpen, FileText} from 'lucide-react'

interface NavItem {
  title: string
  path: string
  type: 'page' | 'blog' | 'practice'
  keywords: string
}

const NAV_INDEX: NavItem[] = [
  {title: 'Sourcing — Enterprise IT Advisory', path: '/sourcing', type: 'practice', keywords: 'data center colocation cloud hosting telecom network infrastructure procurement vendor negotiation CIO sourcing SPY Index'},
  {title: 'Syzygy — Growth Strategy', path: '/growth', type: 'practice', keywords: 'startup founder growth GTM go to market revenue strategy scaling fundraising'},
  {title: 'Stratum — Web3 & Blockchain', path: '/web3', type: 'practice', keywords: 'blockchain crypto token DAO web3 decentralized DeFi'},
  {title: 'ImpactSoul — Impact Consulting', path: '/impactsoul', type: 'practice', keywords: 'impact ESG sustainability B Corp grants NGO regenerative social'},
  {title: 'Process — How We Operate', path: '/process', type: 'page', keywords: 'methodology steps flow circuit'},
  {title: 'Proof — Case Results', path: '/proof', type: 'page', keywords: 'testimonials clients results case studies'},
  {title: 'About — Team & Advisors', path: '/about', type: 'page', keywords: 'team people leadership tony greenberg'},
  {title: 'Blog', path: '/blog', type: 'page', keywords: 'articles writing posts thought leadership'},
  {title: 'Thinking', path: '/thinking', type: 'page', keywords: 'insights essays ideas opinion'},
  {title: 'Engage', path: '/contact', type: 'page', keywords: 'contact form reach out connect engage'},
  {title: 'Privacy Policy', path: '/privacy', type: 'page', keywords: 'privacy data'},
  {title: 'Terms of Service', path: '/terms', type: 'page', keywords: 'terms legal'},
]

function quickMatch(query: string): NavItem[] {
  if (query.trim().length < 2) return []
  const q = query.toLowerCase()
  const tokens = q.split(/\s+/)
  return NAV_INDEX.filter(item => {
    const hay = `${item.title} ${item.keywords}`.toLowerCase()
    return tokens.every(tok => hay.includes(tok))
  }).slice(0, 5)
}

const typeIcons = {page: Globe, blog: BookOpen, practice: FileText}

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export default function SiteSearch({scrolled = false}: {scrolled?: boolean}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const quickResults = quickMatch(query)
  const showQuickNav = query.trim().length >= 2 && quickResults.length > 0 && chat.length === 0

  const openSearch = useCallback(() => {
    setOpen(true)
    setQuery('')
    setChat([])
    setLoading(false)
  }, [])

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery('')
    setChat([])
    setLoading(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    const q = query.trim()
    if (!q || loading) return

    const newChat: ChatMsg[] = [...chat, {role: 'user', content: q}]
    setChat(newChat)
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: q, history: chat.slice(-10)}),
      })
      const data = await res.json()
      setChat(prev => [...prev, {role: 'assistant', content: data.answer}])
    } catch {
      setChat(prev => [...prev, {role: 'assistant', content: 'Something went wrong. Try again or reach out at /contact.'}])
    } finally {
      setLoading(false)
    }
  }, [query, loading, chat])

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openSearch, closeSearch])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [chat, loading])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all text-sm group"
        style={{
          borderColor: scrolled ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)',
          background: scrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.06)',
          color: scrolled ? 'oklch(0.4 0.03 50)' : 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-body)',
        }}
        aria-label="Ask RampRate AI"
      >
        <Sparkles size={15} style={{color: scrolled ? 'oklch(0.65 0.15 75)' : 'oklch(0.82 0.15 75)'}} />
        <span className="hidden md:inline text-xs font-medium">Ask RampRate</span>
        <kbd
          className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-md font-mono"
          style={{
            background: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.10)',
            color: scrolled ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
          }}
        >⌘K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] sm:pt-[12vh]"
          onClick={closeSearch}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          <div
            className="relative w-full max-w-2xl mx-2 sm:mx-4 rounded-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight: '75vh',
              background: 'rgba(10,15,26,0.95)',
              border: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="RampRate AI Assistant"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{background: 'linear-gradient(135deg, oklch(0.82 0.15 75), oklch(0.65 0.2 50))'}}
                >
                  <Sparkles size={16} style={{color: '#0a0f1a'}} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold" style={{fontFamily: 'var(--font-display)'}}>RampRate AI</p>
                  <p className="text-[10px]" style={{color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)'}}>25 years of enterprise intelligence</p>
                </div>
              </div>
              <button onClick={closeSearch} className="p-1 transition-colors" style={{color: 'rgba(255,255,255,0.3)'}}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                <X size={18} />
              </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{minHeight: '120px'}}>
              {chat.length === 0 && !showQuickNav && (
                <div className="text-center py-8">
                  <p className="text-sm mb-4" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}>
                    Ask anything about RampRate, our practices, case results, or enterprise strategy.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["How do you save companies money?", "What is the SPY Index?", "Tell me about Web3 advisory"].map(q => (
                      <button
                        key={q}
                        onClick={() => {setQuery(q); setTimeout(() => inputRef.current?.focus(), 50)}}
                        className="px-3 py-1.5 rounded-full text-xs transition-colors"
                        style={{
                          border: '1px solid rgba(255,255,255,0.10)',
                          color: 'rgba(255,255,255,0.4)',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                          e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick nav results */}
              {showQuickNav && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2"
                     style={{color: 'oklch(0.82 0.15 75 / 0.5)', fontFamily: 'var(--font-mono)'}}>
                    Quick Navigate
                  </p>
                  {quickResults.map(item => {
                    const Icon = typeIcons[item.type]
                    return (
                      <button
                        key={item.path}
                        onClick={() => {router.push(item.path); closeSearch()}}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Icon size={14} className="shrink-0" style={{color: 'rgba(255,255,255,0.25)'}} />
                        <span className="text-sm flex-1" style={{color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)'}}>{item.title}</span>
                        <ArrowRight size={12} style={{color: 'rgba(255,255,255,0.2)'}} />
                      </button>
                    )
                  })}
                  <div className="mt-3 pt-3" style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                    <p className="text-[10px] text-center" style={{color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)'}}>
                      Press Enter to ask the AI instead
                    </p>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'user' ? 'oklch(0.82 0.15 75 / 0.15)' : 'rgba(255,255,255,0.04)',
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)',
                      borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                      border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-2"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '1rem 1rem 1rem 0.25rem',
                    }}
                  >
                    <Loader2 size={14} className="animate-spin" style={{color: 'oklch(0.82 0.15 75)'}} />
                    <span className="text-sm" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 shrink-0" style={{borderTop: '1px solid rgba(255,255,255,0.08)'}}>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors"
                style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)'}}
              >
                <Search size={16} className="shrink-0" style={{color: 'rgba(255,255,255,0.25)'}} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={chat.length > 0 ? 'Follow up...' : 'Ask about sourcing, Web3, case results, strategy...'}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                  style={{color: 'white', fontFamily: 'var(--font-body)'}}
                  disabled={loading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || loading}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{background: 'oklch(0.82 0.15 75)', color: '#0a0f1a'}}
                  onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = 'oklch(0.78 0.15 75)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.82 0.15 75)')}
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px]" style={{color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)'}}>
                  <kbd className="px-1 py-0.5 rounded" style={{background: 'rgba(255,255,255,0.05)'}}>⌘K</kbd> open ·{' '}
                  <kbd className="px-1 py-0.5 rounded" style={{background: 'rgba(255,255,255,0.05)'}}>esc</kbd> close ·{' '}
                  <kbd className="px-1 py-0.5 rounded" style={{background: 'rgba(255,255,255,0.05)'}}>↵</kbd> send
                </span>
                <span className="text-[10px]" style={{color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)'}}>
                  Powered by 25 years of deal intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
