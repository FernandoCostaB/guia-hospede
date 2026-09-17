import { Section } from '@/components/ui/section'

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi',
  tv: 'TV',
  air_conditioning: 'Ar-condicionado',
  kitchen: 'Cozinha',
  washing_machine: 'Máquina de lavar',
  elevator: 'Elevador',
  balcony: 'Varanda',
  bbq_grill: 'Churrasqueira',
  dishwasher: 'Lava-louças',
  pool: 'Piscina',
  gym: 'Academia',
  parking: 'Estacionamento',
}

const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶',
  tv: '📺',
  air_conditioning: '❄️',
  kitchen: '🍳',
  washing_machine: '👕',
  elevator: '🛗',
  balcony: '🌅',
  bbq_grill: '🔥',
  dishwasher: '🍽️',
  pool: '🏊',
  gym: '💪',
  parking: '🅿️',
}

export function Amenities({
  amenities,
}: {
  amenities: Record<string, boolean>
}) {
  const available = Object.entries(amenities).filter(([, v]) => v)

  return (
    <Section title="Amenidades" icon="✨">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {available.map(([key]) => (
          <div
            key={key}
            className="flex items-center gap-2 text-sm p-2 rounded-lg bg-background"
          >
            <span>{AMENITY_ICONS[key] || '•'}</span>
            <span>{AMENITY_LABELS[key] || key.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
