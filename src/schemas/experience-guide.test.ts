import { describe, it, expect } from 'vitest'
import { experienceGuideSchema } from './experience-guide'

const validGuide = {
  welcomeMessage: 'Bem-vindo!',
  restaurants: [
    { name: 'A', distance: '100m', description: 'desc' },
    { name: 'B', distance: '200m', description: 'desc' },
    { name: 'C', distance: '300m', description: 'desc' },
    { name: 'D', distance: '400m', description: 'desc' },
  ],
  attractions: [
    { name: 'X', distance: '1km', description: 'desc' },
    { name: 'Y', distance: '2km', description: 'desc' },
    { name: 'Z', distance: '3km', description: 'desc' },
  ],
  essentials: [
    { name: 'Farmácia', type: 'farmacia', distance: '500m', description: 'desc' },
    { name: 'Mercado', type: 'supermercado', distance: '1km', description: 'desc' },
    { name: 'Hospital', type: 'hospital', distance: '2km', description: 'desc' },
  ],
  seasonalTip: 'Dica sazonal',
}

describe('experienceGuideSchema', () => {
  it('accepts valid guide', () => {
    const result = experienceGuideSchema.safeParse(validGuide)
    expect(result.success).toBe(true)
  })

  it('requires at least 4 restaurants', () => {
    const invalid = {
      ...validGuide,
      restaurants: validGuide.restaurants.slice(0, 3),
    }
    const result = experienceGuideSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('allows at most 5 restaurants', () => {
    const tooMany = {
      ...validGuide,
      restaurants: [
        ...validGuide.restaurants,
        { name: 'E', distance: '500m', description: 'desc' },
        { name: 'F', distance: '600m', description: 'desc' },
      ],
    }
    const result = experienceGuideSchema.safeParse(tooMany)
    expect(result.success).toBe(false)
  })

  it('requires at least 3 attractions', () => {
    const invalid = {
      ...validGuide,
      attractions: validGuide.attractions.slice(0, 2),
    }
    const result = experienceGuideSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('requires at least 3 essentials', () => {
    const invalid = {
      ...validGuide,
      essentials: validGuide.essentials.slice(0, 2),
    }
    const result = experienceGuideSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('requires type field on essentials', () => {
    const invalid = {
      ...validGuide,
      essentials: [
        { name: 'Farmácia', distance: '500m', description: 'desc' },
        { name: 'Mercado', distance: '1km', description: 'desc' },
        { name: 'Hospital', distance: '2km', description: 'desc' },
      ],
    }
    const result = experienceGuideSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects missing welcomeMessage', () => {
    const { welcomeMessage: _wm, ...noWelcome } = validGuide
    const result = experienceGuideSchema.safeParse(noWelcome)
    expect(result.success).toBe(false)
  })

  it('rejects missing seasonalTip', () => {
    const { seasonalTip: _st, ...noTip } = validGuide
    const result = experienceGuideSchema.safeParse(noTip)
    expect(result.success).toBe(false)
  })
})
