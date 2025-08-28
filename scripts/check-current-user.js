const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCurrentUser() {
  console.log('🔍 Checking Current User...\n')

  try {
    // Get all users with their recent activity
    const users = await prisma.user.findMany({
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    console.log('👥 All Users (ordered by most recent activity):')
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name})`)
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Points: ${user.points}`)
      console.log(`   - Profile Complete: ${user.isProfileComplete}`)
      console.log(`   - Last Updated: ${user.updatedAt}`)
      
      if (user.products.length > 0) {
        console.log(`   - Latest Product: ${user.products[0].name} (${user.products[0].createdAt})`)
      }
      
      if (user.comments.length > 0) {
        console.log(`   - Latest Comment: "${user.comments[0].content.substring(0, 30)}..." (${user.comments[0].createdAt})`)
      }
      
      console.log('')
    })

    // Check which user is most likely the current one (based on recent activity)
    const mostRecentUser = users[0]
    console.log('🎯 Most Likely Current User:')
    console.log(`   Email: ${mostRecentUser.email}`)
    console.log(`   Name: ${mostRecentUser.name}`)
    console.log(`   ID: ${mostRecentUser.id}`)

    console.log('\n📝 To access admin dashboard:')
    console.log('1. Logout from current user')
    console.log('2. Login with: alexszabo89@icloud.com / Sofia2022@@')
    console.log('3. Visit: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error checking current user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCurrentUser()
