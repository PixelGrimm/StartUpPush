const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeComments() {
  try {
    console.log('Connecting to database...')
    
    // Remove all comments (this will clean up the database)
    const deletedComments = await prisma.comment.deleteMany({})
    
    console.log(`Deleted ${deletedComments.count} comments from the database`)
    
    console.log('Comments removed successfully!')
  } catch (error) {
    console.error('Error removing comments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeComments()
