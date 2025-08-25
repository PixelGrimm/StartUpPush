const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSales() {
  try {
    console.log('Testing boost sales functionality...')
    
    // Get current month
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    console.log('Current month:', currentMonth)
    
    // Test creating a sales record
    const testRecord = await prisma.boostSales.upsert({
      where: {
        month_planType: {
          month: currentMonth,
          planType: 'boosted'
        }
      },
      update: {},
      create: {
        month: currentMonth,
        planType: 'boosted',
        soldCount: 0,
        maxSpots: 50,
        isActive: true
      }
    })
    
    console.log('✅ Test record created:', testRecord)
    
    // Test fetching records
    const allRecords = await prisma.boostSales.findMany({
      where: {
        month: currentMonth
      }
    })
    
    console.log('✅ All records for current month:', allRecords)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSales()
