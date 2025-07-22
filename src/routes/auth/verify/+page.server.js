import { createSession, verifyMagicLink } from '$lib/server/auth.js'
import { User } from '$lib/server/models.js'
import { redirect } from '@sveltejs/kit'

export async function load({ url, cookies }) {
  const token = url.searchParams.get('token')

  if (!token) {
    throw redirect(303, '/auth/login?error=invalid_token')
  }

  try {
    // Verify the magic link
    const email = await verifyMagicLink(token)

    // Get the user
    const user = await User.findByEmail(email)
    if (!user) {
      throw redirect(303, '/auth/login?error=user_not_found')
    }

    // Create session
    const sessionId = await createSession(user._id)

    // Set session cookie
    cookies.set('session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    throw redirect(303, '/')
  } catch (error) {
    if (error.status === 303) throw error

    console.error('Verification error:', error)
    throw redirect(
      303,
      `/auth/login?error=${encodeURIComponent(error.message)}`
    )
  }
}
