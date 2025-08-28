const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('Resetting admin password...')
    
    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (!existingUser) {
      console.log('❌ Admin user not found! Run create-admin-user.js first.')
      return
    }

    // Hash new password
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update admin user password
    const updatedUser = await prisma.user.update({
      where: { email: 'alexszabo89@icloud.com' },
      data: {
        password: hashedPassword,
        name: 'Alex Szabo',
        isProfileComplete: true
      }
    })

    console.log('✅ Admin password reset successfully!')
    console.log('Email:', updatedUser.email)
    console.log('New Password:', newPassword)
    console.log('Name:', updatedUser.name)
    console.log('Points:', updatedUser.points)
    console.log('Is Profile Complete:', updatedUser.isProfileComplete)

  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
