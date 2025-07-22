import { env } from '$env/dynamic/private'
import { MongoClient } from 'mongodb'

class MongoPoezik {
  constructor() {
    this.db = null
    this._client = null
  }

  init() {
    if (!this.db) {
      this._client = new MongoClient(env.MONGODB_URI)
      this.db = this._client.db('poezik')
    }
  }

  get client() {
    this.init()
    return this._client
  }

  // Add collection getters for your specific collections
  get events() {
    this.init()
    return this.db.collection('events')
  }

  get users() {
    this.init()
    return this.db.collection('users')
  }

  get sessions() {
    this.init()
    return this.db.collection('sessions')
  }

  // Generic collection getter
  getCollection(name) {
    this.init()
    return this.db.collection(name)
  }
}

export default new MongoPoezik()
