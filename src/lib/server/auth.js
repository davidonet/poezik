import { addDays } from 'date-fns'
import { nanoid } from 'nanoid'
import { kv } from './kv.js'
import { User } from './models.js'

export async function createMagicLink(email) {
  const token = nanoid(32)
  const expiresAt = addDays(new Date(), 15)

  await kv.set(
    `magic:${token}`,
    { email, expiresAt: expiresAt.toISOString(), used: false },
    { ex: 60 * 60 * 24 * 15 } // 15 days in seconds
  )

  return token
}

export async function verifyMagicLink(token) {
  const key = `magic:${token}`
  const data = await kv.get(key)

  if (!data) {
    throw new Error('Invalid or expired magic link')
  }

  if (data.used) {
    throw new Error('Magic link has already been used')
  }

  if (new Date(data.expiresAt) < new Date()) {
    await kv.del(key)
    throw new Error('Magic link has expired')
  }

  await kv.set(key, { ...data, used: true }, { ex: 60 })

  return data.email
}

export async function createSession(userId) {
  const sessionId = nanoid(32)
  const expiresAt = addDays(new Date(), 30)

  await kv.set(
    `session:${sessionId}`,
    { userId, expiresAt: expiresAt.toISOString() },
    { ex: 60 * 60 * 24 * 30 } // 30 days in seconds
  )

  return sessionId
}

export async function getSession(sessionId) {
  if (!sessionId) return null

  const data = await kv.get(`session:${sessionId}`)
  if (!data) return null

  if (new Date(data.expiresAt) < new Date()) {
    await kv.del(`session:${sessionId}`)
    return null
  }

  const user = await User.findById(data.userId)
  return user
}

export async function deleteSession(sessionId) {
  if (!sessionId) return
  await kv.del(`session:${sessionId}`)
}
