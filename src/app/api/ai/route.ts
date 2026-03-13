import {NextRequest, NextResponse} from 'next/server'
import {RAMPRATE_SYSTEM_PROMPT} from '@/lib/ramprate-knowledge'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

const API_URL = process.env.FORGE_API_URL
  ? `${process.env.FORGE_API_URL.replace(/\/$/, '')}/v1/chat/completions`
  : 'https://forge.manus.im/v1/chat/completions'

export async function POST(req: NextRequest) {
  try {
    const {question, history = []} = await req.json() as {question: string; history?: ChatMsg[]}

    if (!question?.trim()) {
      return NextResponse.json({error: 'question required'}, {status: 400})
    }

    if (!process.env.FORGE_API_KEY) {
      return NextResponse.json({answer: "AI search is not configured. Please contact us at /contact."}, {status: 200})
    }

    const messages = [
      {role: 'system', content: RAMPRATE_SYSTEM_PROMPT},
      ...history.slice(-10).map(m => ({role: m.role, content: m.content})),
      {role: 'user', content: question.trim()},
    ]

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',
        messages,
        max_tokens: 32768,
        thinking: {budget_tokens: 128},
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const answer = typeof data.choices?.[0]?.message?.content === 'string'
      ? data.choices[0].message.content
      : "That's a conversation for our principals — reach out at ramprate.com/contact."

    return NextResponse.json({answer})
  } catch {
    return NextResponse.json(
      {answer: 'Something went wrong. Try again or reach out at /contact.'},
      {status: 200}
    )
  }
}
