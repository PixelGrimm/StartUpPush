const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestJailedProduct() {
  try {
    console.log('🧪 Creating Test Jailed Product...\n')

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'alexszabo89@icloud.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    console.log('👤 Admin user found:', adminUser.name, adminUser.email)

    // Create a test product with bad words
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Fucking Product',
        tagline: 'This is a test product with bad words',
        description: 'This product contains inappropriate language and should be automatically jailed.',
        website: 'https://example.com',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
        screenshots: JSON.stringify(['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop']),
        category: 'AI Tools',
        tags: 'AI Tools, Test',
        mrr: null,
        userId: adminUser.id,
        isPromoted: false,
        status: 'jailed', // Explicitly set as jailed
      }
    })

    console.log('✅ Test jailed product created successfully!')
    console.log('   Name:', testProduct.name)
    console.log('   Status:', testProduct.status)
    console.log('   ID:', testProduct.id)

    // Create notification for the jailed product
    const notification = await prisma.notification.create({
      data: {
        userId: adminUser.id,
        type: 'PROJECT_JAILED',
        title: 'Test Project Under Review',
        message: `Your test project "${testProduct.name}" has been flagged for review due to inappropriate content.`,
        isRead: false,
      }
    })

    console.log('✅ Notification created for jailed product')
    console.log('   Notification ID:', notification.id)

    console.log('\n🧪 Now test the filtering:')
    console.log('1. Visit the main page - the jailed product should NOT appear')
    console.log('2. Try to access the product directly - should get 404')
    console.log('3. Check admin dashboard - should see it in jailed section')

  } catch (error) {
    console.error('❌ Error creating test jailed product:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestJailedProduct()
