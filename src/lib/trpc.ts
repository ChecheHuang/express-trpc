import { getUser } from '@/lib/jwt'
import { Prisma } from '@prisma/client'
import { TRPCError, initTRPC } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import chalk from 'chalk'
import { OpenApiMeta } from 'trpc-openapi'
import { ZodError, z } from 'zod'

export const createContext = async (options: CreateExpressContextOptions) => {
  const { req, res } = options
  try {
    const url = req.originalUrl || req.url
    const user = await getUser(req)
    const isAllow = true

    return {
      req,
      res,
      user,
      isAllow,
    }
  } catch (error: unknown) {
    return {
      req,
      res,
      message: error as string,
    }
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
export const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter(opts) {
      const { shape, error } = opts
      // console.log(error)
      console.log(chalk.greenBright(`${opts.path} 出現錯誤`))
      console.log(chalk.redBright(shape.message))

      const createMessage = () => {
        if (error.cause instanceof ZodError) return '傳入參數錯誤'
        if (error.cause instanceof Prisma.PrismaClientKnownRequestError) {
          return '資料查詢錯誤'
        }
        return shape.message.length < 20 ? shape.message : '未知錯誤'
      }
      return {
        ...shape,
        message: createMessage(),
        data: {
          ...shape.data,
        },
      }
    },
  })
export const router = t.router

const isAuthMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: ctx.message })
  }
  if (!ctx.isAllow) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '沒有權限' })
  }
  return next({ ctx: { user: ctx.user } })
})

export const procedure = t.procedure

export const privateProcedure = t.procedure.use(isAuthMiddleware)

export const paginationProcedure = privateProcedure.input(
  z.object({
    _page: z.string().optional().default('1'),
    _limit: z.string().optional().default('10'),
    orderValue: z.enum(['asc', 'desc']).optional().default('asc'),
  })
)
