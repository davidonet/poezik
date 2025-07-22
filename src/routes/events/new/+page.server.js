import { Event } from '$lib/server/models.js'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
})

export async function load({ locals }) {
  if (!locals.user?.isAdmin) {
    throw redirect(303, '/events')
  }
}

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user?.isAdmin) {
      throw redirect(303, '/events')
    }

    const data = await request.formData()
    const title = data.get('title')
    const description = data.get('description')
    const date = data.get('date')

    try {
      const validated = eventSchema.parse({ title, description, date })

      const event = await Event.create(validated)

      throw redirect(303, `/events/${event._id}`)
    } catch (error) {
      if (error.status === 303) throw error

      if (error instanceof z.ZodError) {
        return fail(400, {
          error: 'Veuillez remplir tous les champs correctement',
          title,
          description,
          date,
        })
      }

      console.error('Event creation error:', error)
      return fail(500, {
        error: "Échec de la création de l'\u00e9vénement",
        title,
        description,
        date,
      })
    }
  },
}
