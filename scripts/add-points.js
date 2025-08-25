const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addPoints() {
  try {
    // Get the first user (or you can specify by email)
    const user = await prisma.user.findFirst({
      select: { id: true, email: true, points: true }
    })

    if (!user) {
      console.log('No users found in database')
      return
    }

    console.log(`Current user: ${user.email} with ${user.points} points`)

    // Add 50 points
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 50 } },
      select: { email: true, points: true }
    })

    console.log(`✅ Added 50 points to ${updatedUser.email}`)
    console.log(`New balance: ${updatedUser.points} points`)
    console.log('You can now test the boost system!')

  } catch (error) {
    console.error('Error adding points:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addPoints()
