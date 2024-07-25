import { Handler, NextFunction, Request, Response } from 'express'
import os from 'os'
import { serverLog } from './plugin'
export const log = serverLog

export function getLocalIP(): string {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName] as os.NetworkInterfaceInfo[]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]!
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
  return 'localhost'
}

export const catchError = (asyncFn: Handler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await asyncFn(req, res, next)
  } catch (err) {
    next(err)
  }
}
