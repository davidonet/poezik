import { createMagicLink } from '$lib/server/auth.js'
import { sendMagicLinkEmail } from '$lib/server/email.js'
import { User } from '$lib/server/models.js'
import { fail } from '@sveltejs/kit'
import { z } from 'zod'

const emailSchema = z.string().email()

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()
    const email = data.get('email')

    // Validate email
    try {
      emailSchema.parse(email)
    } catch {
      return fail(400, { error: 'Adresse e-mail invalide' })
    }

    try {
      // Check if user exists, create if not
      let user = await User.findByEmail(email)
      if (!user) {
        user = await User.create({
          email,
          name: email.split('@')[0], // Default name from email
          isAdmin: false,
        })
      }

      // Create and send magic link
      const token = await createMagicLink(email)
      await sendMagicLinkEmail(email, token)

      return { success: true }
    } catch (error) {
      console.error('Auth error:', error)
      return fail(500, {
        error: 'Échec de l\'envoi du lien magique. Veuillez réessayer.',
      })
    }
  },
}
