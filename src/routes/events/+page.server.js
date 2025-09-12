import { Event } from '$lib/server/models.js'

export async function load() {
  const events = await Event.findUpcoming()
  const pastEvents = await Event.findPast()

  return {
    events,
    pastEvents,
  }
}
