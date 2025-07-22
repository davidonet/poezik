import { User } from '$lib/server/models.js'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1),
  photo: z.string().url().optional().or(z.literal('')),
})

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(303, '/auth/login')
  }

  return {
    user: locals.user,
  }
}

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login')
    }

    const data = await request.formData()
    const name = data.get('name')
    const photo = data.get('photo')

    try {
      const validated = updateSchema.parse({ name, photo })

      const updateData = {
        name: validated.name,
        ...(validated.photo && { photo: validated.photo }),
      }

      await User.update(locals.user._id, updateData)

      return { success: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return fail(400, { error: "Données d'entrée invalides" })
      }

      console.error('Profile update error:', error)
      return fail(500, { error: 'Échec de la mise à jour du profil' })
    }
  },
}
