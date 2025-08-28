const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCommentFiltering() {
  try {
    console.log('🧪 Testing Comment Filtering...\n')

    // Find the DesignCanvas product (where the "wtf" comment is)
    const product = await prisma.product.findFirst({
      where: { name: 'DesignCanvas' }
    })

    if (!product) {
      console.log('❌ DesignCanvas product not found')
      return
    }

    console.log('📦 Product found:', product.name, 'ID:', product.id)

    // Get all comments for this product
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

    console.log('\n📋 All Comments for DesignCanvas:')
    allComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}"`)
      console.log(`   By: ${comment.user.name} (${comment.user.email})`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   Parent ID: ${comment.parentId || 'None (top-level)'}`)
      console.log(`   Created: ${comment.createdAt}`)
      console.log('')
    })

    // Test the filtering logic that should be used in the API
    const activeTopLevelComments = await prisma.comment.findMany({
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

    console.log('✅ Active Comments (should be visible on website):')
    activeTopLevelComments.forEach((comment, index) => {
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

    console.log('🚫 Jailed Comments (should NOT be visible on website):')
    jailedComments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content}"`)
      console.log(`   By: ${comment.user.name} (${comment.user.email})`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   Parent ID: ${comment.parentId || 'None (top-level)'}`)
      console.log('')
    })

    console.log('📊 Summary:')
    console.log(`   Total comments: ${allComments.length}`)
    console.log(`   Active top-level comments: ${activeTopLevelComments.length}`)
    console.log(`   Jailed comments: ${jailedComments.length}`)
    console.log(`   Comments that should be hidden: ${jailedComments.length}`)

    if (jailedComments.length > 0) {
      console.log('\n✅ SUCCESS: Jailed comments are properly identified and should be filtered out!')
    } else {
      console.log('\n⚠️  No jailed comments found to test filtering')
    }

  } catch (error) {
    console.error('❌ Error testing comment filtering:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCommentFiltering()
