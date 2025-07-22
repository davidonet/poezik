import { Event } from '$lib/server/models.js'

export async function load() {
  const events = await Event.findUpcoming()

  return {
    events,
  }
}
