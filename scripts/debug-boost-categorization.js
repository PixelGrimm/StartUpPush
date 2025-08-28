const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugBoostCategorization() {
  try {
    console.log('🔍 DEBUGGING BOOST CATEGORIZATION\n')

    // Get all promotions
    const allPromotions = await prisma.promotion.findMany({
      include: {
        product: {
          select: {
            name: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📊 ALL PROMOTIONS IN DATABASE:')
    allPromotions.forEach((promo, index) => {
      console.log(`${index + 1}. ${promo.product.name}`)
      console.log(`   Type: ${promo.type}`)
      console.log(`   Created: ${promo.createdAt}`)
      console.log(`   User: ${promo.product.user.name}`)
      console.log('')
    })

    // Current categorization logic
    const boosted = allPromotions.filter(p => p.type === 'boosted')
    const maxBoosted = allPromotions.filter(p => p.type === 'max-boosted')
    const free = allPromotions.filter(p => p.type === 'free')

    console.log('🔢 CURRENT CATEGORIZATION:')
    console.log(`   boosted (7-day): ${boosted.length}`)
    console.log(`   max-boosted (30-day): ${maxBoosted.length}`)
    console.log(`   free: ${free.length}`)
    console.log('')

    // Current revenue calculation
    const currentRevenue = allPromotions.reduce((sum, promo) => {
      if (promo.type === 'boosted') return sum + 50
      if (promo.type === 'max-boosted') return sum + 100
      return sum
    }, 0)

    console.log('💰 CURRENT REVENUE CALCULATION:')
    console.log(`   Total: $${currentRevenue}`)
    console.log(`   Breakdown:`)
    boosted.forEach(promo => {
      console.log(`     ${promo.product.name}: $50 (boosted)`)
    })
    maxBoosted.forEach(promo => {
      console.log(`     ${promo.product.name}: $100 (max-boosted)`)
    })
    console.log('')

    // User's expected categorization
    console.log('🎯 USER EXPECTATION:')
    console.log('   - 2 paid boosts (no free)')
    console.log('   - Revenue: $150')
    console.log('   - 7-day boost should be paid')
    console.log('   - 30-day boost should be paid')
    console.log('')

    // Check if there are any free boosts that shouldn't be free
    const paidBoosts = allPromotions.filter(p => p.type === 'boosted' || p.type === 'max-boosted')
    const freeBoosts = allPromotions.filter(p => p.type === 'free')

    console.log('✅ CORRECTED CATEGORIZATION SHOULD BE:')
    console.log(`   Paid boosts: ${paidBoosts.length}`)
    console.log(`   Free boosts: ${freeBoosts.length}`)
    console.log(`   Total revenue: $${currentRevenue}`)
    console.log('')

    if (freeBoosts.length > 0) {
      console.log('⚠️  ISSUE: Found free boosts that might be incorrectly categorized:')
      freeBoosts.forEach(promo => {
        console.log(`   - ${promo.product.name} (${promo.type})`)
      })
    }

    console.log('🔧 RECOMMENDATION:')
    console.log('   - Check if any boosts are incorrectly marked as "free"')
    console.log('   - Verify that 7-day and 30-day boosts are both paid')
    console.log('   - Update categorization logic if needed')

  } catch (error) {
    console.error('❌ Error debugging boost categorization:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugBoostCategorization()
