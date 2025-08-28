const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestNotification() {
  try {
    console.log('🔔 Creating Test Notification...\n')

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    console.log('👤 Admin user found:', adminUser.name, adminUser.email)

    // Find the jailed project
    const jailedProject = await prisma.product.findFirst({
      where: { 
        name: 'wtf ',
        status: 'jailed'
      }
    })

    if (!jailedProject) {
      console.log('❌ Jailed project "wtf" not found')
      return
    }

    console.log('📦 Jailed project found:', jailedProject.name, 'Status:', jailedProject.status)

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: adminUser.id,
        type: 'PROJECT_JAILED',
        title: 'Project Under Review',
        message: `Your project "${jailedProject.name}" has been flagged for review due to inappropriate content. It will be reviewed by our team.`,
        isRead: false,
      }
    })

    console.log('✅ Notification created successfully!')
    console.log('   ID:', notification.id)
    console.log('   Type:', notification.type)
    console.log('   Title:', notification.title)
    console.log('   Message:', notification.message)

  } catch (error) {
    console.error('❌ Error creating notification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestNotification()
