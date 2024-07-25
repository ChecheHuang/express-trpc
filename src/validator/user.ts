import * as z from "zod"

export const userSchema = z.object({
  id: z.number().int(),
  account: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
