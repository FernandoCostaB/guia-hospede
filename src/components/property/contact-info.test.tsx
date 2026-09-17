import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactInfo } from './contact-info'
import type { Property } from '@/types/property'

const base: Property = {
  id: 1,
  code: 'TEST',
  name: 'Test',
  propertyType: 'Apartamento',
  bedroomQuantity: 1,
  bathroomQuantity: 1,
  guestCapacity: 2,
  street: 'Rua das Flores',
  number: '100',
  complement: 'Apt 5',
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
  hostName: 'Maria Silva',
  hostPhone: '+5548999887766',
}

describe('ContactInfo', () => {
  it('renders host name', () => {
    render(<ContactInfo property={base} />)
    expect(screen.getByText('Maria Silva')).toBeDefined()
  })

  it('formats phone number correctly', () => {
    render(<ContactInfo property={base} />)
    expect(screen.getByText('+55 (48) 99988-7766')).toBeDefined()
  })

  it('renders full address with complement', () => {
    render(<ContactInfo property={base} />)
    expect(screen.getByText(/Rua das Flores, 100, Apt 5/)).toBeDefined()
  })

  it('renders address without complement when null', () => {
    render(<ContactInfo property={{ ...base, complement: null }} />)
    const addressText = screen.getByText(/Rua das Flores, 100, Centro/)
    expect(addressText).toBeDefined()
  })

  it('renders WhatsApp link with correct href', () => {
    render(<ContactInfo property={base} />)
    const link = screen.getByRole('link', { name: /WhatsApp/i })
    expect(link.getAttribute('href')).toBe('https://wa.me/5548999887766')
  })

  it('renders Google Maps link', () => {
    render(<ContactInfo property={base} />)
    const link = screen.getByRole('link', { name: /mapa/i })
    expect(link.getAttribute('href')).toContain('google.com/maps')
  })
})
