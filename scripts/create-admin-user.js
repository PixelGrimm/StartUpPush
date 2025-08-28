const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (existingUser) {
      console.log('✅ Admin user already exists!')
      console.log('Email:', existingUser.email)
      console.log('Name:', existingUser.name)
      console.log('Points:', existingUser.points)
      console.log('Is Banned:', existingUser.isBanned)
      console.log('Is Muted:', existingUser.isMuted)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'alexszabo89@icloud.com',
        name: 'Alex Szabo',
        password: hashedPassword,
        points: 1000,
        isProfileComplete: true,
        isBanned: false,
        isMuted: false,
        username: 'alexszabo'
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', adminUser.email)
    console.log('Password: admin123')
    console.log('Points:', adminUser.points)
    console.log('Is Profile Complete:', adminUser.isProfileComplete)

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
