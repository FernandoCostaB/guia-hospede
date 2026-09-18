import { prisma } from '@/lib/prisma'
import type { ExperienceGuideContent } from '@/types/property'

export async function findGuideByPropertyId(propertyId: number) {
  return prisma.experienceGuide.findUnique({ where: { propertyId } })
}

export async function tryAcquireGenerating(propertyId: number): Promise<boolean> {
  try {
    await prisma.experienceGuide.create({
      data: { propertyId, status: 'GENERATING' },
    })
    return true
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    if (prismaError.code === 'P2002') {
      // unique constraint — another request already claimed it
      return false
    }
    throw error
  }
}

export async function resetToGenerating(propertyId: number) {
  return prisma.experienceGuide.update({
    where: { propertyId },
    data: { status: 'GENERATING', errorMessage: null },
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
