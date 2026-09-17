import { z } from 'zod'

const placeSchema = z.object({
  name: z.string(),
  distance: z.string(),
  description: z.string(),
})

const essentialPlaceSchema = placeSchema.extend({
  type: z.string(),
})

export const experienceGuideSchema = z.object({
  welcomeMessage: z.string(),
  restaurants: z.array(placeSchema).min(4).max(5),
  attractions: z.array(placeSchema).min(3).max(4),
  essentials: z.array(essentialPlaceSchema).min(3),
  seasonalTip: z.string(),
})

export type ExperienceGuideSchema = z.infer<typeof experienceGuideSchema>
