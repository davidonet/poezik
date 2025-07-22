import { nanoid } from 'nanoid'
import db from './db.js'

export const User = {
  async create(data) {
    const user = {
      _id: nanoid(),
      ...data,
      isAdmin: data.isAdmin || false,
    }
    await db.users.insertOne(user)
    return user
  },

  async findById(id) {
    return db.users.findOne({ _id: id })
  },

  async findByEmail(email) {
    return db.users.findOne({ email })
  },

  async findAll() {
    return db.users.find({}).sort({ name: 1 }).toArray()
  },

  async update(id, data) {
    const result = await db.users.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  },

  async delete(id) {
    return db.users.deleteOne({ _id: id })
  },
}

export const Event = {
  async create(data) {
    const event = {
      _id: nanoid(),
      ...data,
      teachers: [],
      participants: [],
      waitingList: [],
    }
    await db.events.insertOne(event)
    return event
  },

  async findById(id) {
    return db.events.findOne({ _id: id })
  },

  async findAll(query = {}) {
    return db.events.find(query).sort({ date: 1 }).toArray()
  },

  async findUpcoming() {
    return db.events
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
    const result = await db.events.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnDocument: 'after' }
    )
    return result
  },

  async addTeacher(eventId, userId) {
    return db.events.findOneAndUpdate(
      { _id: eventId, $expr: { $lt: [{ $size: '$teachers' }, 2] } },
      { $addToSet: { teachers: userId } },
      { returnDocument: 'after' }
    )
  },

  async removeTeacher(eventId, userId) {
    return db.events.findOneAndUpdate(
      { _id: eventId },
      { $pull: { teachers: userId } },
      { returnDocument: 'after' }
    )
  },

  async addParticipant(eventId, userId) {
    const event = await db.events.findOne({ _id: eventId })

    if (!event) return null

    if (event.participants.length < 14) {
      return db.events.findOneAndUpdate(
        { _id: eventId },
        { $addToSet: { participants: userId } },
        { returnDocument: 'after' }
      )
    } else {
      return db.events.findOneAndUpdate(
        { _id: eventId },
        { $addToSet: { waitingList: userId } },
        { returnDocument: 'after' }
      )
    }
  },

  async removeParticipant(eventId, userId) {
    const result = await db.events.findOneAndUpdate(
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
      await db.events.findOneAndUpdate(
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
    return db.events.deleteOne({ _id: id })
  },
}
