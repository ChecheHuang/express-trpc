import { Context, createContext } from '@/lib/trpc'
import logMiddleware from '@/middleware/logMiddleware'
import apiRouter from '@/routers/api'
import { trpcRouter } from '@/routers/trpc'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import express, { NextFunction, Request, Response, Router } from 'express'
import http from 'http'
import createError from 'http-errors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { createOpenApiExpressMiddleware, generateOpenApiDocument } from 'trpc-openapi'
import { Server } from 'ws'
import { PORT, REST_PREFIX, ROUTER_PREFIX, SERVER_ADDRESS, TRPC_PREFIX } from './config'

const globalRouter = Router()

async function startServer() {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  const server = http.createServer(app)
  globalRouter.use(logMiddleware)

  //todo Handle incoming API requests
  globalRouter.use('/api', apiRouter)

  //todo Handle incoming TRPC requests
  globalRouter.use(
    TRPC_PREFIX,
    createExpressMiddleware({
      router: trpcRouter,
      createContext,
    })
  )

  //todo Handle incoming WebSocket requests
  const wss = new Server({ server })

  const wsHandler = applyWSSHandler({
    wss,
    router: trpcRouter,
    createContext: () => ({}) as Context,
  })

  // Generate OpenAPI schema document
  const openApiDocument = generateOpenApiDocument(trpcRouter, {
    title: ' TRPC API',
    description: 'OpenAPI compliant REST API built using tRPC with Express',
    version: '1.0.0',
    baseUrl: SERVER_ADDRESS + ROUTER_PREFIX + REST_PREFIX,
    docsUrl: 'https://github.com/jlalmes/trpc-openapi',
    tags: [],
  })

  // Serve Swagger UI with our OpenAPI schema
  globalRouter.use('/api-docs', swaggerUi.serve)
  globalRouter.get('/api-docs', swaggerUi.setup(openApiDocument))

  //todo Handle incoming OpenAPI requests
  globalRouter.use(REST_PREFIX, createOpenApiExpressMiddleware({ router: trpcRouter, createContext }))

  // Serve static files
  const publicPath = path.join(path.resolve(__dirname, '..'), '/public')
  globalRouter.use(express.static(publicPath))
  globalRouter.get('/*', function (req, res) {
    console.log(req.url)
    res.sendFile(path.join(publicPath, 'index.html'))
  })

  app.use(ROUTER_PREFIX, globalRouter)

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => next(createError(404, 'Endpoint not found')))

  // error handler
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log('----------------------------------------------------------------')
    console.error(err)
    let errorMessage = 'An unknown error occurred: '
    let statusCode = 500
    if (err instanceof createError.HttpError) {
      statusCode = err.status
      errorMessage = err.message
    }
    res.status(statusCode).json({ error: errorMessage })
  })

  server.listen(PORT, () => {
    console.log(chalk.greenBright(`😼[server] :${SERVER_ADDRESS}${ROUTER_PREFIX}`))
    console.log(chalk.blue(`😽[swagger]:${SERVER_ADDRESS}${ROUTER_PREFIX}/api-docs`))
  })
  server.on('error', console.error)

  process.on('SIGTERM', () => {
    wsHandler.broadcastReconnectNotification()
    wss.close()
    server.close()
  })
}

startServer()
