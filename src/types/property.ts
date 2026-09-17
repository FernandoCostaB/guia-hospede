export type Property = {
  id: number
  code: string
  name: string
  propertyType: string
  bedroomQuantity: number
  bathroomQuantity: number
  guestCapacity: number
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  postalCode: string
  wifiNetwork: string
  wifiPassword: string
  isSelfCheckin: boolean
  accessType: string
  accessInstructions: string
  accessPassword: string
  hasParking: boolean
  parkingIdentifier: string | null
  parkingInstructions: string | null
  checkInTime: string
  checkOutTime: string
  allowPet: boolean
  smokingPermitted: boolean
  suitableForChildren: boolean
  suitableForBabies: boolean
  eventsPermitted: boolean
  amenities: Record<string, boolean>
  images: string[]
  hostName: string
  hostPhone: string
}

export type Place = {
  name: string
  distance: string
  description: string
}

export type EssentialPlace = Place & {
  type: string
}

export type ExperienceGuideContent = {
  welcomeMessage: string
  restaurants: Place[]
  attractions: Place[]
  essentials: EssentialPlace[]
  seasonalTip: string
}

export type ExperienceGuide = {
  id: number
  propertyId: number
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  content: ExperienceGuideContent | null
  errorMessage: string | null
  generatedAt: Date | null
}
