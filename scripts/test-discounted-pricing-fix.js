const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDiscountedPricingFix() {
  try {
    console.log('🧪 TESTING DISCOUNTED PRICING FIX\n')

    // Get all promotions
    const allPromotions = await prisma.promotion.findMany({
      include: {
        product: {
          select: {
            name: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📊 ALL PROMOTIONS:')
    allPromotions.forEach((promo, index) => {
      console.log(`${index + 1}. ${promo.product.name}`)
      console.log(`   Type: ${promo.type}`)
      console.log(`   User: ${promo.product.user.name}`)
      console.log(`   Created: ${promo.createdAt}`)
      console.log('')
    })

    // Fixed pricing calculation (with discounts)
    const boosted = allPromotions.filter(p => p.type === 'boosted')
    const maxBoosted = allPromotions.filter(p => p.type === 'max-boosted')

    console.log('💰 FIXED PRICING (WITH DISCOUNTS):')
    console.log('   Boosted (7-day): $15 each (70% off from $50)')
    console.log('   Max-Boosted (30-day): $35 each (80% off from $175)')
    console.log('')

    // Calculate revenue with correct discounted prices
    const boostedRevenue = boosted.length * 15
    const maxBoostedRevenue = maxBoosted.length * 35
    const totalRevenue = boostedRevenue + maxBoostedRevenue

    console.log('📈 REVENUE BREAKDOWN:')
    boosted.forEach(promo => {
      console.log(`   ${promo.product.name}: $15 (boosted)`)
    })
    maxBoosted.forEach(promo => {
      console.log(`   ${promo.product.name}: $35 (max-boosted)`)
    })
    console.log('')

    console.log('💵 TOTAL REVENUE:')
    console.log(`   Boosted (${boosted.length}): $${boostedRevenue}`)
    console.log(`   Max-Boosted (${maxBoosted.length}): $${maxBoostedRevenue}`)
    console.log(`   Total: $${totalRevenue}`)
    console.log('')

    // Check against user expectation
    console.log('🎯 USER EXPECTATION CHECK:')
    console.log(`   Expected: $150 revenue`)
    console.log(`   Actual: $${totalRevenue} revenue`)
    
    if (totalRevenue === 150) {
      console.log('   ✅ MATCHES EXPECTATION!')
    } else {
      console.log('   ❌ DOES NOT MATCH EXPECTATION')
      console.log(`   🔍 Difference: $${Math.abs(150 - totalRevenue)}`)
    }

    // Show what should be in the database for $150
    console.log('\n🔍 TO GET $150 REVENUE:')
    console.log('   Option 1: 2 boosted + 1 max-boosted = $30 + $35 = $65')
    console.log('   Option 2: 1 boosted + 3 max-boosted = $15 + $105 = $120')
    console.log('   Option 3: 0 boosted + 4 max-boosted = $0 + $140 = $140')
    console.log('   Option 4: 10 boosted + 0 max-boosted = $150 + $0 = $150')
    console.log('   Option 5: 3 boosted + 3 max-boosted = $45 + $105 = $150')

    console.log('\n🌐 TESTING:')
    console.log('   1. Visit: http://localhost:3000/admin')
    console.log('   2. Check "Revenue" card')
    console.log('   3. Check "Total Boosts" card')
    console.log('   4. Check "Boost Sales" tab')

  } catch (error) {
    console.error('❌ Error testing discounted pricing fix:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDiscountedPricingFix()
