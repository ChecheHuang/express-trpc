import { loadEnv } from '../lib/loadEnv'
import { getLocalIP } from '../lib/utils'

loadEnv()
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'TOKEN_SECRET'
export const TOKEN_EXPIRE_TIME = 24 * 60 * 60
export const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60

export const PORT = process.env.PORT || 4000

export const SERVER_ADDRESS = `http://${getLocalIP()}:${PORT}`

export const ROUTER_PREFIX = process.env.ROUTER_PREFIX || ''

export const TRPC_PREFIX = process.env.TRPC_PREFIX || '/trpc'

export const REST_PREFIX = process.env.REST_PREFIX || '/api'
