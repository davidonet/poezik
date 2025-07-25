import { Event } from '$lib/server/models.js'
import { DateTime } from 'luxon'
/**
 * Format a date for calendar URLs (YYYYMMDDTHHMMSSZ)
 */
function formatDateForCalendar(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/**
 * Escape text for calendar descriptions
 */
function escapeCalendarText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

/**
 * Generate iCal content for all events
 */
function generateGlobalICalContent(events, origin = 'http://localhost:5173') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poezik//NONSGML Global Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Poezik - Laboratoires',
    'X-WR-CALDESC:Calendrier des laboratoires Poezik',
    'X-WR-TIMEZONE:Europe/Paris',
  ]

  for (const event of events) {
    const startDate = DateTime.fromJSDate(event.date, {
      zone: 'Europe/Paris',
    })
      .set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
      .toUTC()
      .toJSDate()

    const endDate = DateTime.fromJSDate(event.date, { zone: 'Europe/Paris' })
      .set({ hour: 22, minute: 0, second: 0, millisecond: 0 })
      .toUTC()
      .toJSDate()

    // Add teacher info to description if available
    let description = escapeCalendarText(event.description)
    if (event.teachers && event.teachers.length > 0) {
      description += `\\n\\nAnimé par: ${event.teachers.join(', ')}`
    }

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event._id}@poezik.app`,
      `DTSTART:${formatDateForCalendar(startDate)}`,
      `DTEND:${formatDateForCalendar(endDate)}`,
      `DTSTAMP:${formatDateForCalendar(new Date())}`,
      `SUMMARY:${escapeCalendarText(event.title)}`,
      `DESCRIPTION:${description}`,
      'LOCATION:Clap Lodève, 9 Av. Denfert, 34700 Lodève, France',
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      `URL:${origin}/events/${event._id}`,
      'END:VEVENT'
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export async function GET({ url }) {
  try {
    // Get all upcoming events
    const events = await Event.findUpcoming()

    // Use the request URL origin
    const origin = url.origin

    // Generate iCal content
    const icalContent = generateGlobalICalContent(events, origin)

    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="poezik-laboratoires.ics"',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error generating global calendar:', error)
    return new Response('Error generating calendar', { status: 500 })
  }
}
