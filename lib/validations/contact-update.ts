import { z } from "zod"

export const contactUpdateSchema = z.object({
  read: z.boolean()
})
