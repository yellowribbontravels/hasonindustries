import { z } from "zod"

export const gallerySchema = z.object({
  key: z.string().min(1, "Key is required"),
  caption: z.string().nullable().optional(),
  order: z.number().int().default(0)
})

export const galleryUpdateSchema = z.object({
  caption: z.string().nullable().optional(),
  order: z.number().int().optional()
})

export const galleryReorderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number().int()
  })
)
