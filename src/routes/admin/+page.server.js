import { Event, User } from '$lib/server/models.js'
import { error, redirect } from '@sveltejs/kit'

export async function load({ locals }) {
  if (!locals.user?.isAdmin) {
    throw redirect(303, '/')
  }

  const [users, events] = await Promise.all([User.findAll(), Event.findAll()])

  return {
    users,
    events,
  }
}

export const actions = {
  toggleAdmin: async ({ request, locals }) => {
    if (!locals.user?.isAdmin) {
      throw error(403, 'Non autorisé')
    }

    const data = await request.formData()
    const userId = data.get('userId')
    const isAdmin = data.get('isAdmin') === 'true'

    await User.update(userId, { isAdmin })

    return { success: true }
  },
}
