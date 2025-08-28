const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkNotifications() {
  try {
    console.log('🔔 Checking Notifications...\n')

    // Get all notifications
    const notifications = await prisma.notification.findMany({
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

    console.log(`📊 Total Notifications: ${notifications.length}\n`)

    if (notifications.length === 0) {
      console.log('❌ No notifications found in database')
      return
    }

    notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.type}`)
      console.log(`   User: ${notification.user?.name} (${notification.user?.email})`)
      console.log(`   Title: ${notification.title}`)
      console.log(`   Message: ${notification.message}`)
      console.log(`   Read: ${notification.isRead ? 'Yes' : 'No'}`)
      console.log(`   Created: ${notification.createdAt}`)
      console.log('')
    })

    // Check for specific admin user notifications
    const adminNotifications = notifications.filter(n => 
      n.user?.email === 'alexszabo89@icloud.com'
    )

    console.log(`👤 Admin User Notifications: ${adminNotifications.length}`)
    adminNotifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.type} - ${notification.title}`)
    })

  } catch (error) {
    console.error('Error checking notifications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNotifications()
