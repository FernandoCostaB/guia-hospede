import { notFound } from 'next/navigation'
import { findPropertyByCode } from '@/server/repositories/property-repository'
import { PropertyHeader } from '@/components/property/property-header'
import { AccessInfo } from '@/components/property/access-info'
import { Amenities } from '@/components/property/amenities'
import { HouseRules } from '@/components/property/house-rules'
import { ContactInfo } from '@/components/property/contact-info'
import { ExperienceGuideSection } from '@/components/experiences/experience-guide'
import { ChatWidget } from '@/components/chat/chat-widget'
import type { Property } from '@/types/property'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ propertyCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyCode } = await params
  const property = await findPropertyByCode(propertyCode.toUpperCase())
  if (!property) return { title: 'Imóvel não encontrado | Seazone' }
  return {
    title: `${property.name} | Guia do Hóspede`,
    description: `Guia digital do imóvel ${property.name} em ${property.city}/${property.state}. Informações de acesso, Wi-Fi, regras e mais.`,
  }
}

export default async function PropertyPage({ params }: Props) {
  const { propertyCode } = await params
  const property = await findPropertyByCode(propertyCode.toUpperCase())

  if (!property) notFound()

  const p = property as unknown as Property

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <PropertyHeader property={p} />
      <AccessInfo property={p} />
      <Amenities amenities={p.amenities} />
      <HouseRules property={p} />
      <ExperienceGuideSection propertyCode={p.code} />
      <ContactInfo property={p} />
      <ChatWidget propertyCode={p.code} propertyName={p.name} />
    </main>
  )
}
