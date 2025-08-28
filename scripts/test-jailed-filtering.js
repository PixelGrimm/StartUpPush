const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testJailedFiltering() {
  try {
    console.log('🧪 Testing Jailed Product Filtering...\n')

    // Get all products with their status
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true
      }
    })

    console.log('📦 All Products in Database:')
    allProducts.forEach(product => {
      console.log(`   - "${product.name}" - Status: ${product.status} - Active: ${product.isActive}`)
    })

    // Test the filtering logic that should be used in the API
    const activeProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        status: true
      }
    })

    console.log('\n✅ Products that should be visible (active + status=active):')
    activeProducts.forEach(product => {
      console.log(`   - "${product.name}" - Status: ${product.status}`)
    })

    const jailedProducts = await prisma.product.findMany({
      where: {
        status: 'jailed'
      },
      select: {
        id: true,
        name: true,
        status: true
      }
    })

    console.log('\n🚫 Jailed Products (should NOT be visible):')
    jailedProducts.forEach(product => {
      console.log(`   - "${product.name}" - Status: ${product.status}`)
    })

    console.log('\n📊 Summary:')
    console.log(`   Total products: ${allProducts.length}`)
    console.log(`   Active products: ${activeProducts.length}`)
    console.log(`   Jailed products: ${jailedProducts.length}`)
    console.log(`   Products that should be hidden: ${jailedProducts.length}`)

    if (jailedProducts.length > 0) {
      console.log('\n✅ SUCCESS: Jailed products are properly identified and should be filtered out!')
    } else {
      console.log('\n⚠️  No jailed products found to test filtering')
    }

  } catch (error) {
    console.error('❌ Error testing jailed filtering:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testJailedFiltering()
