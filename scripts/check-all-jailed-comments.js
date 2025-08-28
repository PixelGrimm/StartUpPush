const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAllJailedComments() {
  try {
    console.log('🔍 Checking All Jailed Comments Across All Products...\n')

    // Get all jailed comments
    const jailedComments = await prisma.comment.findMany({
      where: { 
        status: 'jailed'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('🚫 ALL Jailed Comments in Database:')
    if (jailedComments.length === 0) {
      console.log('   No jailed comments found in the database')
    } else {
      jailedComments.forEach((comment, index) => {
        console.log(`${index + 1}. "${comment.content}"`)
        console.log(`   By: ${comment.user.name} (${comment.user.email})`)
        console.log(`   On Product: ${comment.product.name} (ID: ${comment.product.id})`)
        console.log(`   Status: ${comment.status}`)
        console.log(`   Parent ID: ${comment.parentId || 'None (top-level)'}`)
        console.log(`   Created: ${comment.createdAt}`)
        console.log('')
      })
    }

    // Get all comments to see the total
    const allComments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        status: true,
        productId: true
      }
    })

    const activeComments = allComments.filter(c => c.status === 'active')
    const jailedCommentsCount = allComments.filter(c => c.status === 'jailed')

    console.log('📊 Comment Status Summary:')
    console.log(`   Total comments: ${allComments.length}`)
    console.log(`   Active comments: ${activeComments.length}`)
    console.log(`   Jailed comments: ${jailedCommentsCount.length}`)

    // Check if there are any comments with status other than 'active' or 'jailed'
    const otherStatusComments = allComments.filter(c => c.status !== 'active' && c.status !== 'jailed')
    if (otherStatusComments.length > 0) {
      console.log(`   Other status comments: ${otherStatusComments.length}`)
      otherStatusComments.forEach(comment => {
        console.log(`     - "${comment.content}" (Status: ${comment.status})`)
      })
    }

    // Test API for each product that has jailed comments
    if (jailedComments.length > 0) {
      console.log('\n🌐 API Testing for Products with Jailed Comments:')
      
      const productsWithJailedComments = [...new Set(jailedComments.map(c => c.product.id))]
      
      for (const productId of productsWithJailedComments) {
        const product = jailedComments.find(c => c.product.id === productId)?.product
        console.log(`\n   Testing API for: ${product?.name} (${productId})`)
        console.log(`   Visit: http://localhost:3000/api/comments?productId=${productId}`)
        console.log(`   Should NOT return jailed comments`)
      }
    }

    console.log('\n🔍 TROUBLESHOOTING:')
    console.log('   If you see jailed comments on the website:')
    console.log('   1. Clear browser cache completely')
    console.log('   2. Try incognito/private browsing mode')
    console.log('   3. Check if using a different browser')
    console.log('   4. Verify the API is returning filtered results')
    console.log('   5. Check if there are any cached API responses')

  } catch (error) {
    console.error('❌ Error checking jailed comments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllJailedComments()
