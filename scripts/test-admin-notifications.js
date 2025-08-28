const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAdminNotifications() {
  try {
    console.log('🧪 Testing Admin Notification System...\n')

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    console.log('👤 Admin user found:', adminUser.name, adminUser.email)

    // Find a test user (non-admin)
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

    // Create a test project for the test user
    const testProject = await prisma.product.create({
      data: {
        name: 'Test Project for Notifications',
        tagline: 'Testing admin notifications',
        description: 'This project is created to test admin notification system.',
        website: 'https://example.com',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
        screenshots: JSON.stringify(['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop']),
        category: 'AI Tools',
        tags: 'AI Tools, Test',
        mrr: null,
        userId: testUser.id,
        isPromoted: false,
        status: 'jailed', // Start as jailed to test approval
      }
    })

    console.log('✅ Test project created:', testProject.name, 'Status:', testProject.status)

    // Create a test comment for the test user
    const testComment = await prisma.comment.create({
      data: {
        content: 'This is a test comment for notification testing',
        userId: testUser.id,
        productId: testProject.id,
        status: 'jailed', // Start as jailed to test approval
      }
    })

    console.log('✅ Test comment created:', testComment.content.substring(0, 30) + '...', 'Status:', testComment.status)

    // Test creating notifications manually
    console.log('\n📧 Testing Notification Creation...')

    // Test project approved notification
    const projectApprovedNotif = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'PROJECT_APPROVED',
        title: 'Project Approved',
        message: `Your project "${testProject.name}" has been approved and is now live on the platform!`,
        productId: testProject.id,
        isRead: false,
      }
    })

    console.log('✅ Project approved notification created:', projectApprovedNotif.id)

    // Test project deleted notification
    const projectDeletedNotif = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'PROJECT_DELETED',
        title: 'Project Deleted',
        message: `Your project "${testProject.name}" has been permanently deleted by our moderation team.`,
        productId: testProject.id,
        isRead: false,
      }
    })

    console.log('✅ Project deleted notification created:', projectDeletedNotif.id)

    // Test comment approved notification
    const commentApprovedNotif = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'COMMENT_APPROVED',
        title: 'Comment Approved',
        message: `Your comment on "${testProject.name}" has been approved and is now visible!`,
        productId: testProject.id,
        commentId: testComment.id,
        isRead: false,
      }
    })

    console.log('✅ Comment approved notification created:', commentApprovedNotif.id)

    // Test comment deleted notification
    const commentDeletedNotif = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'COMMENT_DELETED',
        title: 'Comment Deleted',
        message: `Your comment on "${testProject.name}" has been permanently deleted by our moderation team.`,
        productId: testProject.id,
        commentId: testComment.id,
        isRead: false,
      }
    })

    console.log('✅ Comment deleted notification created:', commentDeletedNotif.id)

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

    console.log('🧪 TESTING COMPLETE!')
    console.log('\n📋 Next Steps:')
    console.log('1. Go to admin dashboard')
    console.log('2. Find the test project/comment in jailed section')
    console.log('3. Click "Approve" or "Delete"')
    console.log('4. Check if test user receives notification')
    console.log('5. Verify notification appears in user\'s notification dropdown')

  } catch (error) {
    console.error('❌ Error testing admin notifications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminNotifications()
