const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateRailway() {
  try {
    console.log('🚀 Starting Railway database migration...')
    
    // Check if columns already exist by trying to query them
    try {
      await prisma.$queryRaw`SELECT "isBanned", "isMuted" FROM "User" LIMIT 1`
      console.log('✅ Columns already exist, no migration needed')
      return
    } catch (error) {
      if (error.code === 'P2022') {
        console.log('📋 Adding missing columns to User table...')
      } else {
        throw error
      }
    }

    // Add isBanned column
    console.log('➕ Adding isBanned column...')
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false`
    
    // Add isMuted column
    console.log('➕ Adding isMuted column...')
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isMuted" BOOLEAN NOT NULL DEFAULT false`
    
    console.log('✅ Migration completed successfully!')
    console.log('📊 Database now has isBanned and isMuted columns')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateRailway()
