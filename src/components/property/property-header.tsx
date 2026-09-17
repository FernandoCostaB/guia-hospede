'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Property } from '@/types/property'

export function PropertyHeader({ property }: { property: Property }) {
  const images = property.images
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div>
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden bg-border">
        {images.length > 0 && (
          <Image
            src={images[currentIndex]}
            alt={`${property.name} - Foto ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Próxima foto"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    i === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <span>{property.propertyType}</span>
          <span>·</span>
          <span>
            {property.city}/{property.state}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{property.name}</h1>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted">
          <span>{property.guestCapacity} hóspedes</span>
          <span>·</span>
          <span>
            {property.bedroomQuantity}{' '}
            {property.bedroomQuantity === 1 ? 'quarto' : 'quartos'}
          </span>
          <span>·</span>
          <span>
            {property.bathroomQuantity}{' '}
            {property.bathroomQuantity === 1 ? 'banheiro' : 'banheiros'}
          </span>
        </div>
      </div>
    </div>
  )
}
