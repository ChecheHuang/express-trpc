import { Router } from 'express'
import { downloadRouter } from './download'
import uploadRouter from './upload'

const apiRouter = Router()

apiRouter.use('/download', downloadRouter)
apiRouter.use('/upload', uploadRouter)

export default apiRouter
