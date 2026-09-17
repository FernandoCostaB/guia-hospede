import { prisma } from '@/lib/prisma'

export async function findPropertyByCode(code: string) {
  return prisma.property.findUnique({ where: { code } })
}

export async function findPropertyWithGuide(code: string) {
  return prisma.property.findUnique({
    where: { code },
    include: { experienceGuide: true },
  })
}
