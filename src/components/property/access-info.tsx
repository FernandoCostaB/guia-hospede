import { Section } from '@/components/ui/section'
import { CopyButton } from '@/components/ui/copy-button'
import type { Property } from '@/types/property'

export function AccessInfo({ property }: { property: Property }) {
  return (
    <Section title="Acesso e Wi-Fi" icon="🔑">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-background">
          <div className="text-sm text-muted mb-1">Rede Wi-Fi</div>
          <div className="font-mono font-medium">{property.wifiNetwork}</div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-sm">{property.wifiPassword}</span>
            <CopyButton text={property.wifiPassword} label="Copiar senha" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-background">
          <div className="text-sm text-muted mb-1">
            Acesso ao imóvel
            {property.isSelfCheckin && (
              <span className="ml-2 text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
                Self check-in
              </span>
            )}
          </div>
          <p className="text-sm">{property.accessInstructions}</p>
          <span className="inline-block mt-2 font-mono font-medium text-lg">
            {property.accessPassword}
          </span>
        </div>

        {property.hasParking && (
          <div className="p-3 rounded-lg bg-background">
            <div className="text-sm text-muted mb-1">Estacionamento</div>
            {property.parkingIdentifier && (
              <p className="font-medium text-sm">
                {property.parkingIdentifier}
              </p>
            )}
            {property.parkingInstructions && (
              <p className="text-sm mt-1">{property.parkingInstructions}</p>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
