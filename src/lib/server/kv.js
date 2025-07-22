import { env } from '$env/dynamic/private'
import { createClient } from '@vercel/kv'

export const kv = createClient({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
})
