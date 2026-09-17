import { prisma } from '@/lib/prisma'
import type { ExperienceGuideContent } from '@/types/property'

export async function findGuideByPropertyId(propertyId: number) {
  return prisma.experienceGuide.findUnique({ where: { propertyId } })
}

export async function createGuideGenerating(propertyId: number) {
  return prisma.experienceGuide.upsert({
    where: { propertyId },
    update: { status: 'GENERATING', errorMessage: null },
    create: { propertyId, status: 'GENERATING' },
  })
}

export async function markGuideCompleted(
  propertyId: number,
  content: ExperienceGuideContent
) {
  return prisma.experienceGuide.update({
    where: { propertyId },
    data: {
      status: 'COMPLETED',
      content: JSON.parse(JSON.stringify(content)),
      generatedAt: new Date(),
      errorMessage: null,
    },
  })
}

export async function markGuideFailed(
  propertyId: number,
  errorMessage: string
) {
  return prisma.experienceGuide.update({
    where: { propertyId },
    data: { status: 'FAILED', errorMessage },
  })
}
