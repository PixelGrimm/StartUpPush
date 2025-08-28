const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testModalSystem() {
  try {
    console.log('🧪 Testing Modal Notification System...\n')

    // Find the test user
    const testUser = await prisma.user.findFirst({
      where: { 
        email: { not: 'alexszabo89@icloud.com' },
        isProfileComplete: true
      }
    })

    if (!testUser) {
      console.log('❌ Test user not found')
      return
    }

    console.log('👤 Test user found:', testUser.name, testUser.email)

    // Find a real product and comment to use for testing
    const realProduct = await prisma.product.findFirst({
      where: { status: 'active' }
    })

    if (!realProduct) {
      console.log('❌ No active products found')
      return
    }

    const realComment = await prisma.comment.findFirst({
      where: { status: 'active' }
    })

    if (!realComment) {
      console.log('❌ No active comments found')
      return
    }

    console.log('📦 Using real product:', realProduct.name)
    console.log('💬 Using real comment:', realComment.content.substring(0, 30) + '...')

    // Create test notifications for different scenarios
    const testNotifications = [
      {
        type: 'PROJECT_JAILED',
        title: 'Project Under Review',
        message: `Your project "${realProduct.name}" has been flagged for review due to inappropriate content.`,
        productId: realProduct.id
      },
      {
        type: 'PROJECT_APPROVED',
        title: 'Project Approved',
        message: `Your project "${realProduct.name}" has been approved and is now live on the platform!`,
        productId: realProduct.id
      },
      {
        type: 'PROJECT_DELETED',
        title: 'Project Deleted',
        message: `Your project "${realProduct.name}" has been permanently deleted by our moderation team.`,
        productId: realProduct.id
      },
      {
        type: 'COMMENT_JAILED',
        title: 'Comment Under Review',
        message: `Your comment on "${realProduct.name}" has been flagged for review by our moderation team.`,
        productId: realProduct.id,
        commentId: realComment.id
      },
      {
        type: 'COMMENT_APPROVED',
        title: 'Comment Approved',
        message: `Your comment on "${realProduct.name}" has been approved and is now visible!`,
        productId: realProduct.id,
        commentId: realComment.id
      },
      {
        type: 'COMMENT_DELETED',
        title: 'Comment Deleted',
        message: `Your comment on "${realProduct.name}" has been permanently deleted by our moderation team.`,
        productId: realProduct.id,
        commentId: realComment.id
      }
    ]

    console.log('📧 Creating Test Notifications...')

    for (const testNotif of testNotifications) {
      const notification = await prisma.notification.create({
        data: {
          userId: testUser.id,
          type: testNotif.type,
          title: testNotif.title,
          message: testNotif.message,
          productId: testNotif.productId,
          commentId: testNotif.commentId,
          isRead: false,
        }
      })

      console.log(`✅ Created ${testNotif.type} notification:`, notification.id)
    }

    // Check all notifications for the test user
    const userNotifications = await prisma.notification.findMany({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\n📋 All Notifications for Test User:')
    userNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. ${notif.type}: ${notif.title}`)
      console.log(`   Message: ${notif.message}`)
      console.log(`   Read: ${notif.isRead}`)
      console.log(`   Created: ${notif.createdAt}`)
      console.log('')
    })

    console.log('🧪 MODAL SYSTEM TESTING COMPLETE!')
    console.log('\n📋 How to Test the Modal:')
    console.log('1. Log in as the test user')
    console.log('2. Click on the notification bell icon')
    console.log('3. Click on any admin notification (PROJECT_* or COMMENT_*)')
    console.log('4. A modal should appear with detailed information')
    console.log('5. Test different notification types:')
    console.log('   - JAILED: Shows orange warning with next steps')
    console.log('   - APPROVED: Shows green success with view button')
    console.log('   - DELETED: Shows red warning with explanation')
    console.log('')

    console.log('🎯 Expected Modal Features:')
    console.log('   ✅ Different icons for each notification type')
    console.log('   ✅ Color-coded badges (orange/red/green)')
    console.log('   ✅ Detailed explanations and next steps')
    console.log('   ✅ Action buttons (View Project, Close, etc.)')
    console.log('   ✅ Professional styling and messaging')

  } catch (error) {
    console.error('❌ Error testing modal system:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testModalSystem()
