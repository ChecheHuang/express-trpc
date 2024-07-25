import { upload } from '@/lib/upload'
import { Router } from 'express'

const uploadRouter = Router()

uploadRouter.post('/', upload.single('file'), async (req, res, next) => {
  console.log(req.file)
  res.send('File uploaded successfully')
})

export default uploadRouter
