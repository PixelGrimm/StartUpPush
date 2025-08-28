const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listAllProducts() {
  try {
    console.log('📦 Listing All Products...\n')

    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Total Products: ${products.length}\n`)

    products.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}"`)
      console.log(`   Status: ${product.status}`)
      console.log(`   Active: ${product.isActive}`)
      console.log(`   User: ${product.user?.name} (${product.user?.email})`)
      console.log(`   Created: ${product.createdAt}`)
      console.log(`   Description: ${product.description?.substring(0, 50)}...`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error listing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listAllProducts()
