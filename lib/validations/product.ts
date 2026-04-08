import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  specs: z.record(z.string(), z.string()).optional().default({}),
  imageKeys: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
})

export const productPartialSchema = productSchema.partial()

export type ProductInput = z.infer<typeof productSchema>
