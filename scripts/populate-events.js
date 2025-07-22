import { MongoClient } from 'mongodb'
import { nanoid } from 'nanoid'

// MongoDB connection URL - adjust as needed
const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DATABASE_NAME = process.env.DATABASE_NAME || 'poezik'

// French dates to convert
const frenchDates = [
  '11 septembre',
  '25 septembre',
  '9 octobre',
  '23 octobre',
  '6 novembre',
  '20 novembre',
  '4 décembre',
  '18 décembre',
  '15 janvier',
  '29 janvier',
  '12 février',
  '26 février',
  '12 mars',
  '26 mars',
  '9 avril',
  '12 avril',
  '23 avril',
  '7 mai',
  '21 mai',
  '4 juin',
  '18 juin',
]

// French month mapping
const frenchMonths = {
  janvier: 0,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
}

function convertFrenchDateToJS(frenchDate) {
  const [day, monthName] = frenchDate.split(' ')
  const dayNum = parseInt(day)
  const monthNum = frenchMonths[monthName]

  // Determine year: 2024 for Sept-Dec, 2025 for Jan-June
  const year = monthNum >= 8 ? 2025 : 2026

  return new Date(year, monthNum, dayNum)
}

async function populateEvents() {
  const client = new MongoClient(MONGODB_URL)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db(DATABASE_NAME)
    const eventsCollection = db.collection('events')

    // Convert dates and create event documents
    const events = frenchDates.map((frenchDate, index) => ({
      _id: nanoid(),
      date: convertFrenchDateToJS(frenchDate),
      title: `Poezik # ${index + 1}`,
      description: `A compléter par les animateurs`,
      teachers: [],
      participants: [],
      waitingList: [],
    }))

    // Insert events
    const result = await eventsCollection.insertMany(events)
    console.log(`${result.insertedCount} events inserted successfully`)

    // Display inserted events for verification
    console.log('\nInserted events:')
    events.forEach((event) => {
      console.log(`- ${event.title}: ${event.date.toLocaleDateString('fr-FR')}`)
    })
  } catch (error) {
    console.error('Error populating events:', error)
  } finally {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

// Run the script
populateEvents()
  .then(() => {
    console.log('Event population script completed.')
  })
  .catch((error) => {
    console.error('Error in event population script:', error)
  })
