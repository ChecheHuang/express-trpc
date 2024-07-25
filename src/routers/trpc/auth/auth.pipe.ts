import { privateProcedure, procedure } from '@/lib/trpc'
import { z } from 'zod'

const tokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const loginProcedure = procedure
  .meta({ openapi: { method: 'POST', path: '/login', tags: ['auth'], summary: '登入', description: '使用帳號密碼登入' } })
  .input(
    z.object({
      account: z.string(),
      password: z.string(),
    })
  )
  .output(tokenSchema)

export const refreshTokenProcedure = procedure
  .meta({
    openapi: { method: 'POST', path: '/refreshToken', tags: ['auth'], summary: '修改 token', description: '修改 token' },
  })
  .input(z.object({ refreshToken: z.string() }))
  .output(tokenSchema)

export const userInfoProcedure = privateProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/userInfo',
      tags: ['auth'],
      protect: true,
      summary: '取得使用者資訊',
      description: '取得使用者資訊',
    },
  })
  .input(z.void())
  .output(
    z.object({
      roles: z.array(z.string()),
      routes: z.array(
        z.object({
          path: z.string(),
          name: z.string(),
          isAllow: z.boolean(),
        })
      ),
      id: z.string(),
      name: z.string(),
    })
  )
