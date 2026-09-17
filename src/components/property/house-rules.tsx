import { Section } from '@/components/ui/section'
import type { Property } from '@/types/property'

function RuleItem({
  label,
  allowed,
  detail,
}: {
  label: string
  allowed: boolean
  detail?: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={allowed ? 'text-success' : 'text-error'}>
        {allowed ? '✓' : '✗'}
      </span>
      <span>
        {label}
        {detail && <span className="text-muted ml-1">({detail})</span>}
      </span>
    </div>
  )
}

export function HouseRules({ property }: { property: Property }) {
  return (
    <Section title="Regras da estadia" icon="📋">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-background">
          <div>
            <div className="text-sm text-muted">Check-in</div>
            <div className="font-semibold">
              A partir das {property.checkInTime}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">Check-out</div>
            <div className="font-semibold">
              Até as {property.checkOutTime}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <RuleItem label="Animais de estimação" allowed={property.allowPet} />
          <RuleItem label="Fumar" allowed={property.smokingPermitted} />
          <RuleItem label="Crianças" allowed={property.suitableForChildren} />
          <RuleItem label="Bebês" allowed={property.suitableForBabies} />
          <RuleItem label="Eventos e festas" allowed={property.eventsPermitted} />
        </div>
      </div>
    </Section>
  )
}
