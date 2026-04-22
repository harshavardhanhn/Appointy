import mongoose from "mongoose";

const connectDB = async () => {
  const dbName = process.env.MONGODB_DB || 'appointy'
  const rawUri = process.env.MONGODB_URI
  const nosrvUri = process.env.MONGODB_URI_NOSRV

  if (!rawUri) {
    console.error('MONGODB_URI is not set in environment')
    process.exit(1)
  }

  const makeUri = (u) => {
    // If user already provided a path/db, don't append
    try {
      const hasSlashAfterHost = u.includes('/')
      return hasSlashAfterHost ? u : `${u}/${dbName}`
    } catch {
      return `${u}/${dbName}`
    }
  }

  const tryConnect = async (uri) => {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  }

  const uriToUse = makeUri(rawUri)

  try {
    await tryConnect(uriToUse)
    console.log('Database Connected')
    return
  } catch (error) {
    console.error('Primary MongoDB connection error:', error.message || error)

    // If SRV/DNS problems, attempt a non-SRV fallback if provided
    const isSrvError = /querySrv|ECONNREFUSED|ENOTFOUND|EAI_AGAIN/i.test(error.message || '')

    if (isSrvError && nosrvUri) {
      const nosrvWithDb = makeUri(nosrvUri)
      console.log('Attempting fallback to non-SRV connection string (MONGODB_URI_NOSRV)')
      try {
        await tryConnect(nosrvWithDb)
        console.log('Database Connected using MONGODB_URI_NOSRV')
        return
      } catch (err2) {
        console.error('Fallback (non-SRV) connection also failed:', err2.message || err2)
      }
    }

    console.error('\nCommon causes: network/DNS blocking, IP whitelist, or incorrect connection string.')
    console.error('Quick fixes:')
    console.error('- Ensure your IP is whitelisted in Atlas Network Access (or add 0.0.0.0/0 temporarily).')
    console.error('- If SRV/DNS lookups are blocked on your network, use a non-SRV connection string and set MONGODB_URI_NOSRV.')
    console.error('- Try switching DNS to 8.8.8.8 or 1.1.1.1 or test from a different network (mobile hotspot).')

    process.exit(1)
  }
}

export default connectDB;
