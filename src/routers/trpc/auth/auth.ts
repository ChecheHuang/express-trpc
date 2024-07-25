import { TokenType, createToken, verifyToken } from '@/lib/jwt'
import prismadb from '@/lib/prismadb'
import { router } from '@/lib/trpc'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { loginProcedure, refreshTokenProcedure } from './auth.pipe'

export const auth = router({
  login: loginProcedure.mutation(async ({ input }) => {
    const { account, password } = input
    const user = await prismadb.user.findFirst({
      select: {
        id: true,
        account: true,
        password: true,
      },
      where: {
        account,
      },
    })

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: '沒有這個帳號' })

    const { password: dbPassword } = user
    const result = await bcrypt.compare(password, dbPassword)
    if (!result) throw new TRPCError({ code: 'UNAUTHORIZED', message: '密碼錯誤' })
    const token = createToken({
      id: user.id,
      account,
    })

    return token
  }),
  refreshToken: refreshTokenProcedure.mutation(async ({ input: { refreshToken } }) => {
    try {
      const decoded = await verifyToken(refreshToken)
      const jwt = createToken(decoded as TokenType)
      return jwt
    } catch (error) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: '請重新登入' })
    }
  }),
})
