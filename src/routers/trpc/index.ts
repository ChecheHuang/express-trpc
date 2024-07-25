import { router } from '@/lib/trpc'
import { auth } from './auth/auth'

export const trpcRouter = router({
  auth,
})
export type AppRouter = typeof trpcRouter
