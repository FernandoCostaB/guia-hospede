'use client'

import { useState, useEffect, useCallback } from 'react'
import { Section } from '@/components/ui/section'
import type { ExperienceGuideContent, Place, EssentialPlace } from '@/types/property'

function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="p-3 rounded-lg bg-background">
      <div className="font-medium text-sm">{place.name}</div>
      <div className="text-xs text-muted mt-0.5">{place.distance}</div>
      <p className="text-sm mt-1">{place.description}</p>
    </div>
  )
}

function EssentialCard({ place }: { place: EssentialPlace }) {
  const typeLabels: Record<string, string> = {
    pharmacy: 'Farmácia',
    supermarket: 'Supermercado',
    hospital: 'Hospital',
    upa: 'UPA',
  }

  return (
    <div className="p-3 rounded-lg bg-background">
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          {typeLabels[place.type] || place.type}
        </span>
        <span className="text-xs text-muted">{place.distance}</span>
      </div>
      <div className="font-medium text-sm mt-1">{place.name}</div>
      <p className="text-sm mt-1 text-muted">{place.description}</p>
    </div>
  )
}

function GuideSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-3/4 bg-border rounded" />
      <div className="h-4 w-full bg-border rounded" />
      <div className="grid gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-border rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ExperienceGuideSection({
  propertyCode,
}: {
  propertyCode: string
}) {
  const [guide, setGuide] = useState<ExperienceGuideContent | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  )

  const fetchGuide = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(`/api/experiences?code=${propertyCode}`)
      const data = await res.json()

      if (data.status === 'COMPLETED' && data.content) {
        setGuide(data.content)
        setStatus('ready')
      } else if (data.status === 'GENERATING') {
        setTimeout(fetchGuide, 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [propertyCode])

  useEffect(() => {
    fetchGuide()
  }, [fetchGuide])

  if (status === 'loading') {
    return (
      <Section title="Guia de Experiências" icon="🗺️">
        <p className="text-sm text-muted mb-4">
          Gerando recomendações personalizadas para a sua região...
        </p>
        <GuideSkeleton />
      </Section>
    )
  }

  if (status === 'error') {
    return (
      <Section title="Guia de Experiências" icon="🗺️">
        <p className="text-sm text-muted mb-3">
          Não foi possível gerar o guia de experiências.
        </p>
        <button
          onClick={fetchGuide}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Tentar novamente
        </button>
      </Section>
    )
  }

  if (!guide) return null

  return (
    <Section title="Guia de Experiências" icon="🗺️">
      <div className="space-y-6">
        <p className="text-sm italic text-muted">{guide.welcomeMessage}</p>

        <div>
          <h3 className="font-semibold text-sm mb-3">🍽️ Restaurantes próximos</h3>
          <div className="grid gap-3">
            {guide.restaurants.map((r) => (
              <PlaceCard key={r.name} place={r} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">🎯 Atrações próximas</h3>
          <div className="grid gap-3">
            {guide.attractions.map((a) => (
              <PlaceCard key={a.name} place={a} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">🏥 Serviços essenciais</h3>
          <div className="grid gap-3">
            {guide.essentials.map((e) => (
              <EssentialCard key={e.name} place={e} />
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <h3 className="font-semibold text-sm mb-1">💡 Dica da estação</h3>
          <p className="text-sm">{guide.seasonalTip}</p>
        </div>
      </div>
    </Section>
  )
}
