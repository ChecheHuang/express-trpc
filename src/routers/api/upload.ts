import { Router } from 'express'
import { upload } from '../../lib/upload'

const uploadRouter = Router()

uploadRouter.post('/', upload.single('file'), async (req, res, next) => {
  console.log(req.file)
  res.send('File uploaded successfully')
})

export default uploadRouter
