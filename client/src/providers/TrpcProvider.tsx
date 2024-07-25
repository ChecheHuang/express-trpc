/* eslint-disable no-useless-catch */
import { RequestInitEsque } from 'node_modules/@trpc/client/dist/internals/types'
import { PropsWithChildren, useMemo } from 'react'
import { AppRouter } from '~/routers/trpc'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateTRPCClientOptions, createTRPCProxyClient, createWSClient, httpLink, splitLink, wsLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { storage } from '@/lib/storage'

export type TrpcOutputs = inferRouterOutputs<AppRouter>
export type TrpcInputs = inferRouterInputs<AppRouter>

const env = import.meta.env
const isSSL = JSON.parse(env.VITE_APP_BACKEND_ISSSL)
const websocketProtocol = isSSL ? 'wss' : 'ws'
const domain = env.VITE_APP_BACKEND_DOMAIN
const port = env.VITE_APP_BACKEND_PORT

const url = env.VITE_APP_GLOBAL_PREFIX + env.VITE_APP_SUFFIX

const wsUrl = `${websocketProtocol}://${domain}:${port}${url}`
const createAuthHeaders = (token?: string): { Authorization?: string } => {
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`,
  }
}

const trpcSetting: CreateTRPCClientOptions<AppRouter> = {
  links: [
    splitLink({
      condition: (op) => {
        return op.type === 'subscription'
      },
      true: wsLink({
        client: createWSClient({
          url: wsUrl,
        }),
      }),
      false: httpLink({
        url,
        headers: createAuthHeaders(storage.get('jwt')?.access),
        fetch: async (url: URL | RequestInfo, options: RequestInit | RequestInitEsque | undefined) => {
          try {
            const res = await fetch(url, options)
            if (res.status < 400) return res
            const data = await res.clone().json()

            const errorMessage = data.error.message || 'Something went wrong'
            if (errorMessage === 'Token已過期') {
              const refreshJwt = await trpcClient.auth.refreshToken.mutate({
                refreshToken: storage.get('jwt')?.refresh,
              })
              storage.set('jwt', refreshJwt)
              const reFetchRes = await fetch(url, {
                ...options,
                headers: {
                  ...options?.headers,
                  ...createAuthHeaders(refreshJwt?.access),
                },
              })
              return reFetchRes
            }
            console.log(errorMessage)
            if (errorMessage === '沒有這個帳號') {
              storage.remove('jwt')
            }
            // console.log(errorMessage)
            return res
          } catch (err) {
            throw err
          }
        },
      }),
    }),
  ],
}

export const trpcClient = createTRPCProxyClient<AppRouter>(trpcSetting)
export const trpcQuery = createTRPCReact<AppRouter>()
const TrpcProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: false,
          },
          mutations: {},
        },
      }),
    []
  )
  const client = useMemo(() => trpcQuery.createClient(trpcSetting), [])
  return (
    <trpcQuery.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcQuery.Provider>
  )
}

export default TrpcProvider
