import { Event } from '$lib/server/models.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
})

export async function load({ params, locals }) {
  // Allow both admins and teachers to edit events
  if (!locals.user) {
    throw redirect(303, '/auth/login')
  }

  const event = await Event.findById(params.id)
  if (!event) {
    throw error(404, 'Laboratoire non trouvé')
  }

  // Check if user can edit this event
  const canEdit =
    locals.user.isAdmin || event.teachers.includes(locals.user._id)
  if (!canEdit) {
    throw error(
      403,
      'Vous ne pouvez modifier que les Laboratoires où vous êtes enseignant'
    )
  }

  return { event }
}

export const actions = {
  default: async ({ request, params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login')
    }

    const event = await Event.findById(params.id)
    if (!event) {
      throw error(404, 'Laboratoire non trouvé')
    }

    // Check if user can edit this event
    const canEdit =
      locals.user.isAdmin || event.teachers.includes(locals.user._id)
    if (!canEdit) {
      throw error(
        403,
        'Vous ne pouvez modifier que les Laboratoires où vous êtes enseignant'
      )
    }

    const data = await request.formData()
    const title = data.get('title')
    const description = data.get('description')
    const date = data.get('date')

    try {
      const validated = eventSchema.parse({ title, description, date })

      await Event.update(params.id, validated)

      return { success: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return fail(400, {
          error: 'Veuillez remplir tous les champs correctement',
          title,
          description,
          date,
        })
      }

      console.error('Event update error:', error)
      return fail(500, {
        error: "Échec de la mise à jour de l'\u00e9vénement",
        title,
        description,
        date,
      })
    }
  },
}
