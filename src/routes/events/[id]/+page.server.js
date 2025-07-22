import { Event, User } from '$lib/server/models.js'
import { error, redirect } from '@sveltejs/kit'

export async function load({ params }) {
  const event = await Event.findById(params.id)

  if (!event) {
    throw error(404, 'Laboratoire non trouvé')
  }

  // Fetch teacher and participant details
  const teachers = await Promise.all(
    event.teachers.map((id) => User.findById(id))
  )
  const participants = await Promise.all(
    event.participants.map((id) => User.findById(id))
  )

  return {
    event,
    teachers: teachers.filter(Boolean),
    participants: participants.filter(Boolean),
  }
}

export const actions = {
  registerTeacher: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login')
    }

    await Event.addTeacher(params.id, locals.user._id)
    return { success: true }
  },

  registerParticipant: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login')
    }

    await Event.addParticipant(params.id, locals.user._id)
    return { success: true }
  },

  unregister: async ({ params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login')
    }

    const event = await Event.findById(params.id)
    if (!event) {
      throw error(404, 'Laboratoire non trouvé')
    }

    if (event.teachers.includes(locals.user._id)) {
      await Event.removeTeacher(params.id, locals.user._id)
    } else {
      await Event.removeParticipant(params.id, locals.user._id)
    }

    return { success: true }
  },

  delete: async ({ params, locals }) => {
    if (!locals.user?.isAdmin) {
      throw error(403, 'Non autorisé')
    }

    await Event.delete(params.id)
    throw redirect(303, '/events')
  },
}
