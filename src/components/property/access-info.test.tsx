import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccessInfo } from './access-info'
import type { Property } from '@/types/property'

const base: Property = {
  id: 1,
  code: 'TEST',
  name: 'Test',
  propertyType: 'Apartamento',
  bedroomQuantity: 1,
  bathroomQuantity: 1,
  guestCapacity: 2,
  street: 'Rua A',
  number: '1',
  complement: null,
  neighborhood: 'Centro',
  city: 'Florianópolis',
  state: 'SC',
  postalCode: '88000-000',
  wifiNetwork: 'MinhaRede_WIFI',
  wifiPassword: 'senha123',
  isSelfCheckin: true,
  accessType: 'Fechadura eletrônica',
  accessInstructions: 'Use o código',
  accessPassword: '9876',
  hasParking: false,
  parkingIdentifier: null,
  parkingInstructions: null,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  allowPet: false,
  smokingPermitted: false,
  suitableForChildren: true,
  suitableForBabies: true,
  eventsPermitted: false,
  amenities: {},
  images: [],
  hostName: 'Host',
  hostPhone: '+5500000000000',
}

describe('AccessInfo', () => {
  it('renders wifi network and password', () => {
    render(<AccessInfo property={base} />)
    expect(screen.getByText('MinhaRede_WIFI')).toBeDefined()
    expect(screen.getByText('senha123')).toBeDefined()
  })

  it('renders access password', () => {
    render(<AccessInfo property={base} />)
    expect(screen.getByText('9876')).toBeDefined()
  })

  it('shows self check-in badge when enabled', () => {
    render(<AccessInfo property={base} />)
    expect(screen.getByText('Self check-in')).toBeDefined()
  })

  it('hides self check-in badge when disabled', () => {
    render(<AccessInfo property={{ ...base, isSelfCheckin: false }} />)
    expect(screen.queryByText('Self check-in')).toBeNull()
  })

  it('shows parking when available', () => {
    render(
      <AccessInfo
        property={{
          ...base,
          hasParking: true,
          parkingIdentifier: 'Vaga 42',
          parkingInstructions: 'Subsolo 2',
        }}
      />
    )
    expect(screen.getByText('Vaga 42')).toBeDefined()
    expect(screen.getByText('Subsolo 2')).toBeDefined()
  })

  it('hides parking section when not available', () => {
    render(<AccessInfo property={base} />)
    expect(screen.queryByText('Estacionamento')).toBeNull()
  })
})
