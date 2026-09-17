import { streamText, createUIMessageStreamResponse, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { findPropertyWithGuide } from '@/server/repositories/property-repository'
import { buildChatSystemPrompt } from '@/server/ai/prompts'
import type { Property, ExperienceGuideContent } from '@/types/property'

const MAX_MESSAGE_LENGTH = 500
const MAX_MESSAGES = 10

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, propertyCode } = body

    if (!propertyCode || typeof propertyCode !== 'string') {
      return new Response('Bad request', { status: 400 })
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Bad request', { status: 400 })
    }

    const property = await findPropertyWithGuide(propertyCode.toUpperCase())
    if (!property) {
      return new Response('Property not found', { status: 404 })
    }

    const guide =
      property.experienceGuide?.status === 'COMPLETED'
        ? (property.experienceGuide.content as unknown as ExperienceGuideContent)
        : null

    const recent = messages.slice(-MAX_MESSAGES)
    for (const m of recent) {
      if (Array.isArray(m.parts)) {
        for (const p of m.parts) {
          if (typeof p.text === 'string') {
            p.text = p.text.slice(0, MAX_MESSAGE_LENGTH)
          }
        }
      }
    }

    const modelMessages = await convertToModelMessages(recent)

    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: buildChatSystemPrompt(property as unknown as Property, guide),
      messages: modelMessages,
      maxOutputTokens: 500,
    })

    return createUIMessageStreamResponse({
      status: 200,
      stream: result.toUIMessageStream(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
