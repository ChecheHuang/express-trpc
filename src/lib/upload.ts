import fs from 'fs'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = 'uploads'
    fs.mkdirSync(folderPath, { recursive: true })

    cb(null, folderPath)
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname
    const timestamp = Date.now()
    const fileExtension = path.extname(originalFileName)
    const fileName = `${path.parse(originalFileName).name}_${timestamp}${fileExtension}`

    cb(null, fileName)
  },
})

export const upload = multer({ storage })
