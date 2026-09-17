import { Section } from '@/components/ui/section'
import type { Property } from '@/types/property'

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  return phone
}

function buildAddress(property: Property) {
  const parts = [
    `${property.street}, ${property.number}`,
    property.complement,
    property.neighborhood,
    `${property.city}/${property.state}`,
    property.postalCode,
  ]
  return parts.filter(Boolean).join(', ')
}

export function ContactInfo({ property }: { property: Property }) {
  const address = buildAddress(property)
  const whatsappUrl = `https://wa.me/${property.hostPhone.replace(/\D/g, '')}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <Section title="Contato e endereço" icon="📞">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-background">
          <div className="text-sm text-muted mb-1">Anfitrião</div>
          <div className="font-medium">{property.hostName}</div>
          <div className="text-sm mt-1">{formatPhone(property.hostPhone)}</div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium bg-[#25d366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>

        <div className="p-3 rounded-lg bg-background">
          <div className="text-sm text-muted mb-1">Endereço</div>
          <p className="text-sm">{address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            📍 Abrir no mapa
          </a>
        </div>
      </div>
    </Section>
  )
}
