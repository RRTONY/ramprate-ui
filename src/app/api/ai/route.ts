import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { RAMPRATE_SYSTEM_PROMPT } from '@/lib/ramprate-knowledge'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

// Daily call limit — resets automatically at midnight UTC
const DAILY_LIMIT = 80
const BLOCK_AT_PERCENT = 0.95

// In-memory counter (resets on cold start; good enough for rate-limiting purposes)
let callsToday = 0
let counterDate = new Date().toISOString().slice(0, 10)

const LIMIT_MESSAGE =
  "We've reached our daily AI query limit. For direct assistance please visit our contact page — we'll get back to you promptly."

const LIMIT_LINK = '/contact'

function resetIfNewDay() {
  const today = new Date().toISOString().slice(0, 10)
  if (today !== counterDate) {
    callsToday = 0
    counterDate = today
  }
}

function isLimitError(err: unknown): boolean {
  if (err instanceof Anthropic.APIError) {
    return err.status === 429 || err.status === 529
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    resetIfNewDay()

    // Block at 95% of daily limit
    if (callsToday >= Math.floor(DAILY_LIMIT * BLOCK_AT_PERCENT)) {
      return NextResponse.json({
        answer: LIMIT_MESSAGE,
        contact: LIMIT_LINK,
        limited: true,
      })
    }

    const { question, history = [] } = await req.json() as {
      question: string
      history?: ChatMsg[]
    }

    if (!question?.trim()) {
      return NextResponse.json({ error: 'question required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        answer: 'AI search is not configured. Please contact us at /contact.',
      })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const messages: Anthropic.MessageParam[] = [
      ...history.slice(-6).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: question.trim() },
    ]

    callsToday++

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: RAMPRATE_SYSTEM_PROMPT,
      messages,
    })

    const answer =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : "That's a conversation for our principals — reach out at ramprate.com/contact."

    return NextResponse.json({ answer })
  } catch (err) {
    if (isLimitError(err)) {
      return NextResponse.json({
        answer: LIMIT_MESSAGE,
        contact: LIMIT_LINK,
        limited: true,
      })
    }
    return NextResponse.json({
      answer: LIMIT_MESSAGE,
      contact: LIMIT_LINK,
      limited: true,
    })
  }
}
