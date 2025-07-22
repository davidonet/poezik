import { nanoid } from 'nanoid'
import { getCollection } from './db.js'

export const User = {
  async create(data) {
    const users = await getCollection('users')
    const user = {
      _id: nanoid(),
      ...data,
      isAdmin: data.isAdmin || false,
    }
    await users.insertOne(user)
    return user
  },

  async findById(id) {
    const users = await getCollection('users')
    return users.findOne({ _id: id })
  },

  async findByEmail(email) {
    const users = await getCollection('users')
    return users.findOne({ email })
  },

  async findAll() {
    const users = await getCollection('users')
    return users.find({}).sort({ name: 1 }).toArray()
  },

  async update(id, data) {
    const users = await getCollection('users')
    const result = await users.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  },

  async delete(id) {
    const users = await getCollection('users')
    return users.deleteOne({ _id: id })
  },
}

export const Event = {
  async create(data) {
    const events = await getCollection('events')
    const event = {
      _id: nanoid(),
      ...data,
      teachers: [],
      participants: [],
      waitingList: [],
    }
    await events.insertOne(event)
    return event
  },

  async findById(id) {
    const events = await getCollection('events')
    return events.findOne({ _id: id })
  },

  async findAll(query = {}) {
    const events = await getCollection('events')
    return events.find(query).sort({ date: 1 }).toArray()
  },

  async findUpcoming() {
    const events = await getCollection('events')

    return events
      .aggregate([
        {
          $match: { date: { $gte: new Date() } },
        },

        {
          $lookup: {
            from: 'users',
            localField: 'teachers',
            foreignField: '_id',
            as: 'teacherDetails',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'participants',
            foreignField: '_id',
            as: 'participantDetails',
          },
        },
        {
          $set: {
            teachers: {
              $map: {
                input: '$teacherDetails',
                as: 'teacher',
                in: '$$teacher.name',
              },
            },
            participants: {
              $map: {
                input: '$participantDetails',
                as: 'participant',
                in: '$$participant.name',
              },
            },
          },
        },
        {
          $project: {
            teacherDetails: 0,
            participantDetails: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray()
  },

  async update(id, data) {
    const events = await getCollection('events')
    const result = await events.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  },

  async addTeacher(eventId, userId) {
    const events = await getCollection('events')
    return events.findOneAndUpdate(
      { _id: eventId, $expr: { $lt: [{ $size: '$teachers' }, 2] } },
      { $addToSet: { teachers: userId } },
      { returnDocument: 'after' }
    )
  },

  async removeTeacher(eventId, userId) {
    const events = await getCollection('events')
    return events.findOneAndUpdate(
      { _id: eventId },
      { $pull: { teachers: userId } },
      { returnDocument: 'after' }
    )
  },

  async addParticipant(eventId, userId) {
    const events = await getCollection('events')
    const event = await events.findOne({ _id: eventId })

    if (!event) return null

    if (event.participants.length < 14) {
      return events.findOneAndUpdate(
        { _id: eventId },
        { $addToSet: { participants: userId } },
        { returnDocument: 'after' }
      )
    } else {
      return events.findOneAndUpdate(
        { _id: eventId },
        { $addToSet: { waitingList: userId } },
        { returnDocument: 'after' }
      )
    }
  },

  async removeParticipant(eventId, userId) {
    const events = await getCollection('events')
    const result = await events.findOneAndUpdate(
      { _id: eventId },
      { $pull: { participants: userId, waitingList: userId } },
      { returnDocument: 'after' }
    )

    if (
      result &&
      result.waitingList.length > 0 &&
      result.participants.length < 14
    ) {
      const nextUserId = result.waitingList[0]
      await events.findOneAndUpdate(
        { _id: eventId },
        {
          $pull: { waitingList: nextUserId },
          $push: { participants: nextUserId },
        }
      )
    }

    return result
  },

  async delete(id) {
    const events = await getCollection('events')
    return events.deleteOne({ _id: id })
  },
}
