import { z } from 'zod'

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
  photo: z.string().optional(),
  isAdmin: z.boolean().default(false),
})

export const EventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  teachers: z.array(z.string()).max(2),
  participants: z.array(z.string()).max(14),
  waitingList: z.array(z.string()),
})

export const MagicLinkSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
})
