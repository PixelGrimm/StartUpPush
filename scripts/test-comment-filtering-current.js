const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCommentFilteringCurrent() {
  try {
    console.log('🧪 Testing Current Comment Filtering State...\n')

    // Find the DesignCanvas product (where the "wtf" comment is)
    const product = await prisma.product.findFirst({
      where: { name: 'DesignCanvas' }
    })

    if (!product) {
      console.log('❌ DesignCanvas product not found')
      return
    }

    console.log('📦 Product found:', product.name, 'ID:', product.id)

    // Get ALL comments for this product (including jailed ones)
    const allComments = await prisma.comment.findMany({
      where: { productId: product.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\n📋 ALL Comments for DesignCanvas (including jailed):')
    allComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}"`)
      console.log(`   By: ${comment.user.name} (${comment.user.email})`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   Parent ID: ${comment.parentId || 'None (top-level)'}`)
      console.log(`   Created: ${comment.createdAt}`)
      console.log('')
    })

    // Test the API filtering logic
    const activeComments = await prisma.comment.findMany({
      where: { 
        productId: product.id,
        parentId: null, // Only top-level comments
        status: 'active' // Only active comments
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        replies: {
          where: {
            status: 'active' // Only active replies
          },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('✅ ACTIVE Comments (should be visible on website):')
    activeComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}"`)
      console.log(`   By: ${comment.user.name} (${comment.user.email})`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   Replies: ${comment.replies.length}`)
      
      if (comment.replies.length > 0) {
        console.log('   Active Replies:')
        comment.replies.forEach((reply, replyIndex) => {
          console.log(`     ${replyIndex + 1}. "${reply.content}" by ${reply.user.name} (${reply.status})`)
        })
      }
      console.log('')
    })

    const jailedComments = await prisma.comment.findMany({
      where: { 
        productId: product.id,
        status: 'jailed'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    console.log('🚫 JAILED Comments (should NOT be visible on website):')
    jailedComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}"`)
      console.log(`   By: ${comment.user.name} (${comment.user.email})`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   Parent ID: ${comment.parentId || 'None (top-level)'}`)
      console.log('')
    })

    console.log('📊 Summary:')
    console.log(`   Total comments: ${allComments.length}`)
    console.log(`   Active comments: ${activeComments.length}`)
    console.log(`   Jailed comments: ${jailedComments.length}`)
    console.log(`   Comments that should be hidden: ${jailedComments.length}`)

    if (jailedComments.length > 0) {
      console.log('\n✅ SUCCESS: Jailed comments are properly identified and should be filtered out!')
      console.log('\n🔍 TROUBLESHOOTING:')
      console.log('   If jailed comments are still visible on the website:')
      console.log('   1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)')
      console.log('   2. Check if using a different browser')
      console.log('   3. Try incognito/private browsing mode')
      console.log('   4. Verify the API is returning filtered results')
    } else {
      console.log('\n⚠️  No jailed comments found to test filtering')
    }

    // Test the API directly
    console.log('\n🌐 API TEST:')
    console.log(`   Visit: http://localhost:3000/api/comments?productId=${product.id}`)
    console.log('   Should only return active comments, no jailed ones')

  } catch (error) {
    console.error('❌ Error testing comment filtering:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCommentFilteringCurrent()
