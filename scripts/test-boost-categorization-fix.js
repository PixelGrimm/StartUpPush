const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBoostCategorizationFix() {
  try {
    console.log('🧪 TESTING BOOST CATEGORIZATION FIX\n')

    // Simulate the fixed API logic
    const allPromotions = await prisma.promotion.findMany({
      select: {
        type: true
      }
    })

    // Fixed categorization logic
    const freeBoosts = allPromotions.filter(p => p.type === 'free').length
    const paidBoosts = allPromotions.filter(p => p.type === 'boosted' || p.type === 'max-boosted').length
    const totalBoosts = allPromotions.length

    // Fixed revenue calculation
    const totalRevenue = allPromotions.reduce((sum, promo) => {
      if (promo.type === 'boosted') return sum + 50
      if (promo.type === 'max-boosted') return sum + 100
      return sum
    }, 0)

    console.log('✅ FIXED CATEGORIZATION:')
    console.log(`   Total Boosts: ${totalBoosts}`)
    console.log(`   Free Boosts: ${freeBoosts}`)
    console.log(`   Paid Boosts: ${paidBoosts}`)
    console.log(`   Total Revenue: $${totalRevenue}`)
    console.log('')

    // Show breakdown
    const boosted = allPromotions.filter(p => p.type === 'boosted').length
    const maxBoosted = allPromotions.filter(p => p.type === 'max-boosted').length
    const free = allPromotions.filter(p => p.type === 'free').length

    console.log('📊 BREAKDOWN:')
    console.log(`   boosted (7-day): ${boosted} - $${boosted * 50}`)
    console.log(`   max-boosted (30-day): ${maxBoosted} - $${maxBoosted * 100}`)
    console.log(`   free: ${free} - $0`)
    console.log('')

    // Check if this matches user expectation
    console.log('🎯 USER EXPECTATION CHECK:')
    console.log(`   Expected: 2 paid, 0 free, $150 revenue`)
    console.log(`   Actual: ${paidBoosts} paid, ${freeBoosts} free, $${totalRevenue} revenue`)
    
    if (paidBoosts === 2 && freeBoosts === 0 && totalRevenue === 150) {
      console.log('   ✅ MATCHES EXPECTATION!')
    } else {
      console.log('   ❌ DOES NOT MATCH EXPECTATION')
      console.log('   🔍 Need to investigate further...')
    }

    console.log('\n🌐 TESTING:')
    console.log('   1. Visit: http://localhost:3000/admin')
    console.log('   2. Check "Total Boosts" card')
    console.log('   3. Should show "Free: 0 | Paid: 2"')
    console.log('   4. Revenue should be $150')

  } catch (error) {
    console.error('❌ Error testing boost categorization fix:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBoostCategorizationFix()
