import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

const secretKey = process.env.NEXTAUTH_SECRET ?? 'secret'

export class JwtService {
  sign(payload: Partial<User>, expiresInSecond: number) {
    return jwt.sign(payload, secretKey, { expiresIn: `${expiresInSecond}s` })
  }

  verify(token: string): Partial<User> | null {
    try {
      return jwt.verify(token, secretKey) as Partial<User>
    } catch {
      return null
    }
  }

  createPair(payload: Partial<User>): {
    accessToken: string
    refreshToken: string
  } {
    const accessToken = this.sign(payload, 3600)
    const refreshToken = this.sign(payload, 2592000)

    return { accessToken, refreshToken }
  }
}
