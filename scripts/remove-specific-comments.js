const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeSpecificComments() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!');

    // Delete comments containing specific text
    const result = await prisma.comment.deleteMany({
      where: {
        OR: [
          { content: { contains: 'wtf', mode: 'insensitive' } },
          { content: { contains: 'hi', mode: 'insensitive' } },
          { content: { contains: 'test', mode: 'insensitive' } },
          { content: { contains: 'hello', mode: 'insensitive' } },
        ]
      }
    });

    console.log(`Deleted ${result.count} comments containing specified text`);

    // Also delete any comments that are very short (likely test comments)
    const shortComments = await prisma.comment.deleteMany({
      where: {
        content: {
          in: ['wtf', 'wtf is this', 'hi', 'hello', 'test', 'a', 'b', 'c']
        }
      }
    });

    console.log(`Deleted ${shortComments.count} short test comments`);

    console.log('Comment cleanup completed successfully!');
  } catch (error) {
    console.error('Error removing comments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeSpecificComments();
