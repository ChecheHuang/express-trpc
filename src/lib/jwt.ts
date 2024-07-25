import { REFRESH_TOKEN_EXPIRE_TIME, TOKEN_EXPIRE_TIME } from '@/config'
import { Request } from 'express'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'

export interface TokenType {
  id: number
  account: string
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenType
    }
  }
}

export const createToken = ({ id, account }: TokenType) => {
  const accessToken = signToken(
    {
      id,
      account,
    },
    TOKEN_EXPIRE_TIME
  )
  const refreshToken = signToken(
    {
      id,
      account,
    },
    REFRESH_TOKEN_EXPIRE_TIME
  )
  return { accessToken, refreshToken }
}

export const signToken = (payload: JwtPayload, expiresIn?: string | number): string => {
  const options = expiresIn ? { expiresIn } : {}
  const token = jwt.sign(payload, process.env.TOKEN_SECRET || '', options)
  return token
}

export const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET || '', (error, decoded) => {
      if (error) {
        if (error instanceof TokenExpiredError) {
          reject('Token已過期')
        }
        reject('Token 驗證失敗。請重新登入。')
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

export const getUser = async (req: Request) => {
  const token = req.headers['authorization']?.split(' ')[1] || ''
  return (await verifyToken(token)) as TokenType
}
