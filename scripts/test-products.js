const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testProducts() {
  console.log('🧪 Testing Products API...\n')

  try {
    // Check all products
    const allProducts = await prisma.product.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        votes: {
          select: { value: true, userId: true }
        },
        _count: {
          select: { votes: true, comments: true }
        }
      }
    })

    console.log('📦 All Products:')
    allProducts.forEach(product => {
      const upvotes = product.votes.filter(v => v.value === 1).length
      const downvotes = product.votes.filter(v => v.value === -1).length
      console.log(`   - ${product.name}`)
      console.log(`     Status: ${product.status}`)
      console.log(`     Active: ${product.isActive}`)
      console.log(`     User: ${product.user.name} (${product.user.email})`)
      console.log(`     Votes: ${upvotes} up, ${downvotes} down`)
      console.log(`     Total votes: ${product._count.votes}`)
      console.log(`     Comments: ${product._count.comments}`)
      console.log('')
    })

    // Check products that should be visible
    const visibleProducts = await prisma.product.findMany({
      where: { 
        isActive: true,
        status: 'active'
      }
    })

    console.log(`✅ Visible Products: ${visibleProducts.length}`)
    visibleProducts.forEach(product => {
      console.log(`   - ${product.name}`)
    })

    // Check if there are any issues with the data
    const productsWithIssues = await prisma.product.findMany({
      where: {
        OR: [
          { isActive: false },
          { status: { not: 'active' } }
        ]
      }
    })

    if (productsWithIssues.length > 0) {
      console.log('\n⚠️ Products with issues:')
      productsWithIssues.forEach(product => {
        console.log(`   - ${product.name}: isActive=${product.isActive}, status=${product.status}`)
      })
    } else {
      console.log('\n✅ All products are active and have correct status')
    }

  } catch (error) {
    console.error('❌ Error testing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProducts()
