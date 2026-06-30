import {NextRequest, NextResponse} from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {RAMPRATE_SYSTEM_PROMPT} from '@/lib/ramprate-knowledge'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const {question, history = []} = await req.json() as {question: string; history?: ChatMsg[]}

    if (!question?.trim()) {
      return NextResponse.json({error: 'question required'}, {status: 400})
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({answer: "AI search is not configured. Please contact us at /contact."}, {status: 200})
    }

    const client = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY})

    const messages: Anthropic.MessageParam[] = [
      ...history.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      {role: 'user', content: question.trim()},
    ]

    const response = await client.beta.messages.create({
      betas: ['prompt-caching-2024-07-31'],
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      system: [
        {
          type: 'text',
          text: RAMPRATE_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    })

    const answer = response.content[0]?.type === 'text'
      ? response.content[0].text
      : "That's a conversation for our principals — reach out at ramprate.com/contact."

    return NextResponse.json({answer})
  } catch {
    return NextResponse.json(
      {answer: 'Something went wrong. Try again or reach out at /contact.'},
      {status: 200}
    )
  }
}
