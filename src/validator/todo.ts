import * as z from 'zod'

export const todoSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
  status: z.boolean(),
})
