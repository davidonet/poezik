import { MONGODB_URI } from '$env/static/private'
import { MongoClient } from 'mongodb'

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function getDB() {
  const client = await clientPromise
  return client.db('poezik')
}

export async function getCollection(name) {
  const db = await getDB()
  return db.collection(name)
}
