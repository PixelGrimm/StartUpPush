const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetMonthlySales() {
  try {
    console.log('🔄 Resetting monthly boost sales...')
    
    // Get current month in UK time (00:00:01)
    const now = new Date()
    // Convert to UK time (UTC+0 in winter, UTC+1 in summer)
    const ukTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}))
    const currentMonth = `${ukTime.getFullYear()}-${String(ukTime.getMonth() + 1).padStart(2, '0')}`
    console.log('Current month (UK time):', currentMonth)
    console.log('UK time:', ukTime.toLocaleString("en-US", {timeZone: "Europe/London"}))
    
    // Reset all sales records for the current month
    const result = await prisma.boostSales.updateMany({
      where: {
        month: currentMonth
      },
      data: {
        soldCount: 0,
        isActive: true
      }
    })
    
    console.log(`✅ Reset ${result.count} sales records for ${currentMonth}`)
    
    // Show current status
    const currentRecords = await prisma.boostSales.findMany({
      where: {
        month: currentMonth
      }
    })
    
    console.log('📊 Current monthly status:')
    currentRecords.forEach(record => {
      console.log(`  ${record.planType}: ${record.soldCount}/${record.maxSpots} sold`)
    })
    
  } catch (error) {
    console.error('❌ Error resetting monthly sales:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetMonthlySales()
