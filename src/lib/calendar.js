/**
 * Utility functions for generating calendar links
 */

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
 * Generate a Google Calendar URL for an event
 */
export function generateGoogleCalendarUrl(event) {
  try {
    const startDate = new Date(event.date)
    // Set to 20:00 Paris time
    const parisTime = new Date(
      startDate.toLocaleString('en-US', { timeZone: 'Europe/Paris' })
    )
    parisTime.setHours(20, 0, 0, 0)
    startDate.setTime(parisTime.getTime())
    // Assume 2 hour duration if no end time is specified
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
      details: event.description,
      location: 'Clap Lodève, 9 Av. Denfert, 34700 Lodève, France',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  } catch (error) {
    console.error('Error generating Google Calendar URL:', error)
    return '#'
  }
}

/**
 * Generate an Apple Calendar (iCal) content for an event
 */
function generateICalContent(event) {
  const startDate = new Date(event.date)
  // Set start time to 20:00 Paris time
  const parisTime = new Date(
    startDate.toLocaleString('en-US', { timeZone: 'Europe/Paris' })
  )
  parisTime.setHours(20, 0, 0, 0)
  startDate.setTime(parisTime.getTime())
  // Assume 2 hour duration if no end time is specified
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

  // iCal format
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poezik//NONSGML Event//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event._id}@poezik.app`,
    `DTSTART:${formatDateForCalendar(startDate)}`,
    `DTEND:${formatDateForCalendar(endDate)}`,
    `DTSTAMP:${formatDateForCalendar(new Date())}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(event.description)}`,
    'LOCATION:Clap Lodève, 9 Av. Denfert, 34700 Lodève, France',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/**
 * Download an iCal file for Apple Calendar
 */
export function downloadAppleCalendarFile(event) {
  try {
    const icalContent = generateICalContent(event)
    const blob = new Blob([icalContent], {
      type: 'text/calendar;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (error) {
    console.error('Error downloading Apple Calendar file:', error)
    alert('Erreur lors du téléchargement du fichier calendrier')
  }
}
