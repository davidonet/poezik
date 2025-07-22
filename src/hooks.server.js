import { getSession } from '$lib/server/auth.js'

export async function handle({ event, resolve }) {
  const sessionId = event.cookies.get('session')

  if (sessionId) {
    try {
      const user = await getSession(sessionId)
      if (user) {
        event.locals.user = user
      }
    } catch (error) {
      console.error('Session error:', error)
      // Clear invalid session
      event.cookies.delete('session', { path: '/' })
    }
  }

  return resolve(event)
}
