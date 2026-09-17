import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Amenities } from './amenities'

describe('Amenities', () => {
  it('renders only available amenities', () => {
    render(
      <Amenities amenities={{ wifi: true, pool: false, tv: true }} />
    )
    expect(screen.getByText('Wi-Fi')).toBeDefined()
    expect(screen.getByText('TV')).toBeDefined()
    expect(screen.queryByText('Piscina')).toBeNull()
  })

  it('uses label mapping for known amenities', () => {
    render(<Amenities amenities={{ air_conditioning: true }} />)
    expect(screen.getByText('Ar-condicionado')).toBeDefined()
  })

  it('falls back to formatted key for unknown amenities', () => {
    render(<Amenities amenities={{ hot_tub: true }} />)
    expect(screen.getByText('hot tub')).toBeDefined()
  })

  it('renders nothing when all amenities are false', () => {
    const { container } = render(
      <Amenities amenities={{ wifi: false, pool: false }} />
    )
    const grid = container.querySelector('.grid')!
    expect(grid.children.length).toBe(0)
  })
})
