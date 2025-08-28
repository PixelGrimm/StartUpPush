const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixUserIssues() {
  console.log('🔧 Fixing User Issues...\n')

  try {
    // Check if the test user exists
    const testUser = await prisma.user.findUnique({
      where: { email: '1@1.com' }
    })

    if (!testUser) {
      console.log('❌ Test user (1@1.com) not found. Creating...')
      
      const newUser = await prisma.user.create({
        data: {
          email: '1@1.com',
          name: 'Test User',
          username: 'testuser',
          password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m', // password: 123
          points: 0,
          isProfileComplete: true
        }
      })
      
      console.log('✅ Created test user:', newUser.email, 'ID:', newUser.id)
    } else {
      console.log('✅ Test user exists:', testUser.email, 'ID:', testUser.id)
    }

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user (alexszabo89@icloud.com) not found. Creating...')
      
      const newAdmin = await prisma.user.create({
        data: {
          email: 'alexszabo89@icloud.com',
          name: 'Admin User',
          username: 'admin',
          password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m', // password: Sofia2022@@
          points: 0,
          isProfileComplete: true
        }
      })
      
      console.log('✅ Created admin user:', newAdmin.email, 'ID:', newAdmin.id)
    } else {
      console.log('✅ Admin user exists:', adminUser.email, 'ID:', adminUser.id)
    }

    // Check all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, isProfileComplete: true }
    })

    console.log('\n📊 All Users:')
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.name}) - ID: ${user.id} - Profile Complete: ${user.isProfileComplete}`)
    })

    // Check products
    const products = await prisma.product.findMany({
      select: { id: true, name: true, userId: true }
    })

    console.log('\n📦 All Products:')
    products.forEach(product => {
      console.log(`   - ${product.name} - ID: ${product.id} - User ID: ${product.userId}`)
    })

    console.log('\n🎉 User issues fixed!')
    console.log('\n📝 Next steps:')
    console.log('1. Try logging in with: 1@1.com / 123')
    console.log('2. Try submitting a product')
    console.log('3. Try commenting on products')
    console.log('4. Visit admin dashboard: alexszabo89@icloud.com / Sofia2022@@')

  } catch (error) {
    console.error('❌ Error fixing user issues:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserIssues()
