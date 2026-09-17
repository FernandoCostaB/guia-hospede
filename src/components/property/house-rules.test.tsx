import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HouseRules } from './house-rules'
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
  wifiNetwork: 'net',
  wifiPassword: 'pass',
  isSelfCheckin: true,
  accessType: 'Fechadura',
  accessInstructions: 'Use o código',
  accessPassword: '1234',
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

describe('HouseRules', () => {
  it('renders check-in and check-out times', () => {
    render(<HouseRules property={base} />)
    expect(screen.getByText(/15:00/)).toBeDefined()
    expect(screen.getByText(/11:00/)).toBeDefined()
  })

  it('shows ✗ for disallowed rules', () => {
    render(<HouseRules property={base} />)
    const petRule = screen.getByText('Animais de estimação').closest('div')!
    expect(petRule.textContent).toContain('✗')
  })

  it('shows ✓ for allowed rules', () => {
    render(<HouseRules property={base} />)
    const childrenRule = screen.getByText('Crianças').closest('div')!
    expect(childrenRule.textContent).toContain('✓')
  })

  it('reflects allowPet=true', () => {
    render(<HouseRules property={{ ...base, allowPet: true }} />)
    const petRule = screen.getByText('Animais de estimação').closest('div')!
    expect(petRule.textContent).toContain('✓')
  })
})
