const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRealTimeNotifications() {
  try {
    console.log('🧪 Testing Real-Time Notification System...\n')

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

    // Create a test notification that should trigger real-time updates
    const testNotification = await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'PROJECT_JAILED',
        title: 'Real-Time Test - Project Under Review',
        message: `Your project "${realProduct.name}" has been flagged for review. This notification should appear immediately without page refresh.`,
        productId: realProduct.id,
        isRead: false,
      }
    })

    console.log('✅ Created real-time test notification:', testNotification.id)
    console.log('   Type:', testNotification.type)
    console.log('   Title:', testNotification.title)
    console.log('   Message:', testNotification.message)

    console.log('\n🧪 REAL-TIME TESTING INSTRUCTIONS:')
    console.log('1. Log in as the test user (123@123.com)')
    console.log('2. Keep the website open')
    console.log('3. The notification should appear within 3-5 seconds')
    console.log('4. No page refresh should be needed')
    console.log('5. Check the notification bell for the new notification')
    console.log('')

    console.log('🎯 EXPECTED BEHAVIOR:')
    console.log('   ✅ Notification appears automatically')
    console.log('   ✅ No page refresh required')
    console.log('   ✅ Real-time updates working')
    console.log('   ✅ Modal opens when clicked')
    console.log('')

    console.log('📊 TECHNICAL DETAILS:')
    console.log('   - Polling every 3 seconds for new notifications')
    console.log('   - Zustand store for state management')
    console.log('   - Immediate UI updates')
    console.log('   - Admin notification types trigger modals')

  } catch (error) {
    console.error('❌ Error testing real-time notifications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRealTimeNotifications()
