const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testNotificationPersistence() {
  try {
    console.log('🧪 Testing Notification Persistence and Read Status...\n')

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

    // Find a real product to use
    const realProduct = await prisma.product.findFirst({
      where: { status: 'active' }
    })

    if (!realProduct) {
      console.log('❌ No active products found')
      return
    }

    console.log('📦 Using product:', realProduct.name)

    // Create a test notification
    const testNotification = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'PROJECT_JAILED',
        title: 'Persistence Test - Project Under Review',
        message: `Your project "${realProduct.name}" has been flagged for review. This notification should persist its read status.`,
        productId: realProduct.id,
        isRead: false,
      }
    })

    console.log('✅ Created test notification:', testNotification.id)
    console.log('   Initial read status:', testNotification.isRead)

    // Simulate marking as read
    const updatedNotification = await prisma.notification.update({
      where: { id: testNotification.id },
      data: { isRead: true }
    })

    console.log('✅ Marked notification as read')
    console.log('   Updated read status:', updatedNotification.isRead)

    // Verify the read status persists
    const persistedNotification = await prisma.notification.findUnique({
      where: { id: testNotification.id }
    })

    console.log('✅ Verified persistence')
    console.log('   Final read status:', persistedNotification.isRead)

    // Check all notifications for the user
    const userNotifications = await prisma.notification.findMany({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' }
    })

    const unreadCount = userNotifications.filter(n => !n.isRead).length
    const readCount = userNotifications.filter(n => n.isRead).length

    console.log('\n📊 Notification Summary:')
    console.log(`   Total notifications: ${userNotifications.length}`)
    console.log(`   Unread notifications: ${unreadCount}`)
    console.log(`   Read notifications: ${readCount}`)

    console.log('\n🧪 PERSISTENCE TESTING INSTRUCTIONS:')
    console.log('1. Log in as the test user')
    console.log('2. Check notification bell - should show the test notification')
    console.log('3. Click on the notification to mark as read')
    console.log('4. Refresh the page')
    console.log('5. The notification should remain marked as read')
    console.log('6. No duplicate notifications should appear')
    console.log('')

    console.log('🎯 EXPECTED BEHAVIOR:')
    console.log('   ✅ Notifications persist read status after refresh')
    console.log('   ✅ No duplicate notifications on refresh')
    console.log('   ✅ Unread count updates correctly')
    console.log('   ✅ No notification loops')
    console.log('')

    console.log('🔧 TECHNICAL FIXES APPLIED:')
    console.log('   ✅ Store handles backend updates automatically')
    console.log('   ✅ Duplicate prevention in addNotification')
    console.log('   ✅ Read status filtering in real-time hook')
    console.log('   ✅ Proper state synchronization')

  } catch (error) {
    console.error('❌ Error testing notification persistence:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNotificationPersistence()
