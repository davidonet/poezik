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

  // Get check-in data
  const checkIns = await Event.getCheckIns(params.id)

  return {
    event,
    teachers: teachers.filter(Boolean),
    participants: participants.filter(Boolean),
    checkIns,
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

  updateCheckIn: async ({ request, params, locals }) => {
    if (!locals.user?.isAdmin) {
      throw error(403, 'Non autorisé')
    }

    const formData = await request.formData()
    const userId = formData.get('userId')
    const isPresent = formData.get('isPresent') === 'on'
    const hasPaid = formData.get('hasPaid') === 'on'
    const comment = formData.get('comment') || ''

    const checkInData = {
      isPresent,
      hasPaid,
      comment,
      updatedAt: new Date().toISOString(),
    }

    await Event.updateCheckIn(params.id, userId, checkInData)
    return { success: true }
  },
}
