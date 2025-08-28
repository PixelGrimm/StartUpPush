const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateRailway() {
  try {
    console.log('🚀 Starting Railway database migration...')
    
    // Test database connection first
    try {
      await prisma.$connect()
      console.log('✅ Database connection successful')
    } catch (error) {
      console.log('⚠️ Database connection failed, skipping migration:', error.message)
      return
    }
    
    // Check if columns already exist by trying to query them
    try {
      await prisma.$queryRaw`SELECT "isBanned", "isMuted" FROM "User" LIMIT 1`
      console.log('✅ Columns already exist, no migration needed')
      return
    } catch (error) {
      if (error.code === 'P2022') {
        console.log('📋 Adding missing columns to User table...')
      } else {
        console.log('⚠️ Unexpected error checking columns:', error.message)
        return
      }
    }

    // Add isBanned column
    try {
      console.log('➕ Adding isBanned column...')
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false`
      console.log('✅ isBanned column added successfully')
    } catch (error) {
      console.log('⚠️ Error adding isBanned column:', error.message)
    }
    
    // Add isMuted column
    try {
      console.log('➕ Adding isMuted column...')
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isMuted" BOOLEAN NOT NULL DEFAULT false`
      console.log('✅ isMuted column added successfully')
    } catch (error) {
      console.log('⚠️ Error adding isMuted column:', error.message)
    }
    
    console.log('✅ Migration process completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    // Don't throw error, just log it
  } finally {
    try {
      await prisma.$disconnect()
    } catch (error) {
      // Ignore disconnect errors
    }
  }
}

migrateRailway()
