import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

export function serverLog(this: any, data?: any) {
  const logsDir = path.join(__dirname, '../../logs')
  const filePath = path.join(logsDir, 'serverLog.json')
  const jsonString = JSON.stringify(data ? data : this, null, 2)

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }

  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err)
    } else {
      console.log('檔案位置' + chalk.bgYellowBright(filePath))
    }
  })
}

declare global {
  interface Console {
    cuslog: (data?: any) => void
  }
}

console.cuslog = serverLog
