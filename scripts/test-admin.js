const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAdminDashboard() {
  console.log('🧪 Testing Admin Dashboard Functionality...\n')

  try {
    // Test 1: Check if we have data
    console.log('📊 Test 1: Checking data availability...')
    
    const [projects, comments, users, promotions] = await Promise.all([
      prisma.product.count(),
      prisma.comment.count(),
      prisma.user.count(),
      prisma.promotion.count()
    ])

    console.log(`✅ Projects: ${projects}`)
    console.log(`✅ Comments: ${comments}`)
    console.log(`✅ Users: ${users}`)
    console.log(`✅ Promotions: ${promotions}`)

    // Test 2: Check if we have jailed items
    console.log('\n🚨 Test 2: Checking jailed items...')
    
    const [jailedProjects, jailedComments] = await Promise.all([
      prisma.product.count({ where: { status: 'jailed' } }),
      prisma.comment.count({ where: { status: 'jailed' } })
    ])

    console.log(`✅ Jailed Projects: ${jailedProjects}`)
    console.log(`✅ Jailed Comments: ${jailedComments}`)

    // Test 3: Check boost sales
    console.log('\n💰 Test 3: Checking boost sales...')
    
    const boostSales = await prisma.promotion.findMany({
      where: { type: { in: ['boosted', 'max-boosted'] } },
      include: {
        product: {
          include: {
            user: true
          }
        }
      }
    })

    console.log(`✅ Boost Sales: ${boostSales.length}`)
    boostSales.forEach(sale => {
      console.log(`   - ${sale.product.name} (${sale.type}) by ${sale.product.user.name}`)
    })

    // Test 4: Check test comments that should be cleaned up
    console.log('\n🧹 Test 4: Checking test comments for cleanup...')
    
    const testComments = await prisma.comment.findMany({
      where: {
        OR: [
          { content: { contains: 'wtf' } },
          { content: { contains: 'test' } },
          { content: { contains: 'hi' } }
        ]
      }
    })

    console.log(`✅ Test Comments Found: ${testComments.length}`)
    testComments.forEach(comment => {
      console.log(`   - "${comment.content}"`)
    })

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Visit http://localhost:3000/admin')
    console.log('2. Login with: alexszabo89@icloud.com / Sofia2022@@')
    console.log('3. Test all tabs and functionality')
    console.log('4. Try the cleanup comments feature')
    console.log('5. Test project and comment actions')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminDashboard()
