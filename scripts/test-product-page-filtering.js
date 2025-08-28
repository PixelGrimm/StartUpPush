const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testProductPageFiltering() {
  try {
    console.log('🧪 Testing Product Page Comment Filtering...\n')

    // Find the DesignCanvas product
    const product = await prisma.product.findFirst({
      where: { name: 'DesignCanvas' }
    })

    if (!product) {
      console.log('❌ DesignCanvas product not found')
      return
    }

    console.log('📦 Product found:', product.name, 'ID:', product.id)

    // Test the OLD query (without status filter)
    const oldQueryComments = await prisma.comment.findMany({
      where: {
        productId: product.id,
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('❌ OLD Query Results (without status filter):')
    oldQueryComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}" - Status: ${comment.status}`)
      if (comment.replies.length > 0) {
        console.log('   Replies:')
        comment.replies.forEach((reply, replyIndex) => {
          console.log(`     ${replyIndex + 1}. "${reply.content}" - Status: ${reply.status}`)
        })
      }
    })

    // Test the NEW query (with status filter)
    const newQueryComments = await prisma.comment.findMany({
      where: {
        productId: product.id,
        parentId: null, // Only get top-level comments
        status: 'active' // Only show active comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        replies: {
          where: {
            status: 'active' // Only show active replies
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('\n✅ NEW Query Results (with status filter):')
    newQueryComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}" - Status: ${comment.status}`)
      if (comment.replies.length > 0) {
        console.log('   Replies:')
        comment.replies.forEach((reply, replyIndex) => {
          console.log(`     ${replyIndex + 1}. "${reply.content}" - Status: ${reply.status}`)
        })
      }
    })

    console.log('\n📊 Comparison:')
    console.log(`   Old query returned: ${oldQueryComments.length} comments`)
    console.log(`   New query returned: ${newQueryComments.length} comments`)
    
    const jailedInOld = oldQueryComments.filter(c => c.status === 'jailed').length
    const jailedInNew = newQueryComments.filter(c => c.status === 'jailed').length
    
    console.log(`   Jailed comments in old query: ${jailedInOld}`)
    console.log(`   Jailed comments in new query: ${jailedInNew}`)

    if (jailedInOld > 0 && jailedInNew === 0) {
      console.log('\n✅ SUCCESS: Filtering is working!')
      console.log('   Jailed comments are now properly filtered out')
    } else if (jailedInOld === 0) {
      console.log('\n⚠️  No jailed comments found to test')
    } else {
      console.log('\n❌ ISSUE: Filtering not working properly')
    }

    console.log('\n🌐 TESTING:')
    console.log('   1. Visit: http://localhost:3000/p/designcanvas')
    console.log('   2. Check comments section')
    console.log('   3. Should only see active comments')
    console.log('   4. Jailed comments should be hidden')

  } catch (error) {
    console.error('❌ Error testing product page filtering:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProductPageFiltering()
