import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Run migration on startup
async function runMigration() {
  try {
    console.log('🔧 Checking database schema...')
    
    // Check if columns exist
    try {
      await prisma.$queryRaw`SELECT "isBanned", "isMuted" FROM "User" LIMIT 1`
      console.log('✅ Database schema is up to date')
      return
    } catch (error: any) {
      if (error.code === 'P2022') {
        console.log('📋 Adding missing columns to User table...')
        
        // Add isBanned column
        try {
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false`
          console.log('✅ Added isBanned column')
        } catch (e: any) {
          if (e.code !== '42701') { // Column already exists
            console.log('⚠️ Error adding isBanned column:', e.message)
          }
        }
        
        // Add isMuted column
        try {
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "isMuted" BOOLEAN NOT NULL DEFAULT false`
          console.log('✅ Added isMuted column')
        } catch (e: any) {
          if (e.code !== '42701') { // Column already exists
            console.log('⚠️ Error adding isMuted column:', e.message)
          }
        }
        
        console.log('✅ Database migration completed')
      } else {
        console.log('⚠️ Unexpected database error:', error.message)
      }
    }
  } catch (error) {
    console.log('⚠️ Migration error (non-critical):', error)
  }
}

// Run migration in background
runMigration().catch(console.error)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
