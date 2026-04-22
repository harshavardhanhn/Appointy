import connectDB from '../config/mongodb.js'
import mongoose from 'mongoose'

const run = async () => {
  try {
    await connectDB()

    const db = mongoose.connection.db

    console.log('Creating indexes...')

    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    console.log('Created unique index on users.email')

    await db.collection('doctors').createIndex({ email: 1 }, { unique: true })
    console.log('Created unique index on doctors.email')

    // Prevent double-booking: unique per doctor + date + time
    await db.collection('appointments').createIndex(
      { docId: 1, slotDate: 1, slotTime: 1 },
      { unique: true, name: 'unique_doctor_slot' }
    )
    console.log('Created compound unique index on appointments (docId, slotDate, slotTime)')

    console.log('All indexes created successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error creating indexes:', error.message || error)
    process.exit(1)
  }
}

run()
