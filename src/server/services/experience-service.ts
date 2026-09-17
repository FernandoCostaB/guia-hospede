import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { experienceGuideSchema } from '@/schemas/experience-guide'
import { buildExperiencePrompt } from '@/server/ai/prompts'
import {
  findGuideByPropertyId,
  createGuideGenerating,
  markGuideCompleted,
  markGuideFailed,
} from '@/server/repositories/experience-repository'
import type { Property, ExperienceGuideContent } from '@/types/property'

export async function getOrGenerateGuide(property: Property) {
  const existing = await findGuideByPropertyId(property.id)

  if (existing?.status === 'COMPLETED' && existing.content) {
    return {
      status: 'COMPLETED' as const,
      content: existing.content as unknown as ExperienceGuideContent,
    }
  }

  if (existing?.status === 'GENERATING') {
    return { status: 'GENERATING' as const, content: null }
  }

  await createGuideGenerating(property.id)

  try {
    const { object } = await generateObject({
      model: anthropic('claude-haiku-4-5-20251001'),
      schema: experienceGuideSchema,
      prompt: buildExperiencePrompt(property),
    })

    await markGuideCompleted(property.id, object)
    return { status: 'COMPLETED' as const, content: object }
  } catch (error) {
    console.error('Experience guide generation failed:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    await markGuideFailed(property.id, message)
    return { status: 'FAILED' as const, content: null }
  }
}
