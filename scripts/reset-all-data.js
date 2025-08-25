const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetAllData() {
  try {
    console.log('🔄 Starting complete data reset...')
    
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('🗑️  Deleting all existing data...')
    
    await prisma.notification.deleteMany({})
    await prisma.comment.deleteMany({})
    await prisma.update.deleteMany({})
    await prisma.promotion.deleteMany({})
    await prisma.boostSales.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.user.deleteMany({})
    
    console.log('✅ All existing data deleted')
    
    // Create fresh dummy users
    console.log('👥 Creating dummy users...')
    
    const user1 = await prisma.user.create({
      data: {
        email: 'demo@startuppush.com',
        name: 'Demo User',
        points: 150,
        isProfileComplete: true
      }
    })
    
    const user2 = await prisma.user.create({
      data: {
        email: 'founder@startuppush.com',
        name: 'Startup Founder',
        points: 75,
        isProfileComplete: true
      }
    })
    
    const user3 = await prisma.user.create({
      data: {
        email: 'dev@startuppush.com',
        name: 'Developer',
        points: 200,
        isProfileComplete: true
      }
    })
    
    console.log('✅ Created 3 dummy users')
    
    // Create dummy projects
    console.log('🚀 Creating dummy projects...')
    
    const project1 = await prisma.product.create({
      data: {
        name: 'TaskFlow Pro',
        tagline: 'Revolutionary task management for remote teams',
        description: 'TaskFlow Pro is a cutting-edge project management platform designed specifically for remote and hybrid teams. With AI-powered task prioritization, real-time collaboration features, and seamless integrations, it helps teams stay organized and productive.',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop',
        website: 'https://taskflowpro.com',
        category: 'Productivity',
        tags: 'productivity,remote-work,ai,project-management',
        userId: user1.id,
        isActive: true
      }
    })
    
    const project2 = await prisma.product.create({
      data: {
        name: 'EcoTracker',
        tagline: 'Track your carbon footprint with smart insights',
        description: 'EcoTracker is an innovative mobile app that helps individuals and businesses track their carbon footprint in real-time. Using advanced algorithms and IoT integration, it provides personalized recommendations for reducing environmental impact.',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
        website: 'https://ecotracker.app',
        category: 'Sustainability',
        tags: 'sustainability,climate,iot,mobile-app',
        userId: user2.id,
        isActive: true
      }
    })
    
    const project3 = await prisma.product.create({
      data: {
        name: 'CodeMentor AI',
        tagline: 'AI-powered coding mentor for developers',
        description: 'CodeMentor AI is an intelligent coding assistant that provides personalized learning paths, code reviews, and real-time suggestions. Built with advanced machine learning, it adapts to your coding style and helps you become a better developer.',
        logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
        website: 'https://codementor.ai',
        category: 'Developer Tools',
        tags: 'ai,programming,education,machine-learning',
        userId: user3.id,
        isActive: true
      }
    })
    
    const project4 = await prisma.product.create({
      data: {
        name: 'HealthSync',
        tagline: 'Unified health data platform for better care',
        description: 'HealthSync connects all your health devices and apps into one comprehensive platform. With secure data sharing, AI-powered insights, and seamless integration with healthcare providers, it revolutionizes personal health management.',
        logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=150&h=150&fit=crop',
        website: 'https://healthsync.io',
        category: 'Healthcare',
        tags: 'healthcare,iot,ai,data-integration',
        userId: user1.id,
        isActive: true
      }
    })
    
    const project5 = await prisma.product.create({
      data: {
        name: 'FinFlow',
        tagline: 'Smart financial planning for modern life',
        description: 'FinFlow is an intelligent financial planning app that helps users manage budgets, track expenses, and plan for the future. With AI-driven insights and automated categorization, it makes financial management effortless and insightful.',
        logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop',
        website: 'https://finflow.app',
        category: 'Finance',
        tags: 'finance,ai,budgeting,planning',
        userId: user2.id,
        isActive: true
      }
    })
    
    console.log('✅ Created 5 dummy projects')
    
    // Create dummy comments
    console.log('💬 Creating dummy comments...')
    
    const comments = [
      {
        content: 'This looks amazing! The AI features are exactly what I need for my team.',
        userId: user2.id,
        productId: project1.id
      },
      {
        content: 'Great concept! How does it handle large teams with complex workflows?',
        userId: user3.id,
        productId: project1.id
      },
      {
        content: 'Love the sustainability focus! This could really help companies go green.',
        userId: user1.id,
        productId: project2.id
      },
      {
        content: 'The carbon tracking feature is brilliant. Would love to see API access.',
        userId: user3.id,
        productId: project2.id
      },
      {
        content: 'As a developer, this AI mentor concept is exactly what I\'ve been looking for!',
        userId: user1.id,
        productId: project3.id
      },
      {
        content: 'The learning path feature sounds promising. Can it adapt to different programming languages?',
        userId: user2.id,
        productId: project3.id
      },
      {
        content: 'Health data integration is crucial. How do you ensure privacy and security?',
        userId: user3.id,
        productId: project4.id
      },
      {
        content: 'This could revolutionize how we manage our health data. Great work!',
        userId: user2.id,
        productId: project4.id
      },
      {
        content: 'Financial planning with AI insights? Sign me up!',
        userId: user1.id,
        productId: project5.id
      },
      {
        content: 'The automated categorization feature sounds really useful for busy professionals.',
        userId: user3.id,
        productId: project5.id
      }
    ]
    
    for (const comment of comments) {
      await prisma.comment.create({ data: comment })
    }
    
    console.log('✅ Created 10 dummy comments')
    
    // Create dummy votes
    console.log('👍 Creating dummy votes...')
    
    const votes = [
      { userId: user1.id, productId: project2.id, value: 1 },
      { userId: user1.id, productId: project3.id, value: 1 },
      { userId: user1.id, productId: project4.id, value: 1 },
      { userId: user2.id, productId: project1.id, value: 1 },
      { userId: user2.id, productId: project3.id, value: 1 },
      { userId: user2.id, productId: project5.id, value: 1 },
      { userId: user3.id, productId: project1.id, value: 1 },
      { userId: user3.id, productId: project2.id, value: 1 },
      { userId: user3.id, productId: project4.id, value: 1 },
      { userId: user3.id, productId: project5.id, value: 1 }
    ]
    
    for (const vote of votes) {
      await prisma.vote.create({ data: vote })
    }
    
    console.log('✅ Created 10 dummy votes')
    
    // Create dummy promotions (boosts)
    console.log('🚀 Creating dummy promotions...')
    
    const promotions = [
      {
        productId: project1.id,
        type: 'boosted',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        isActive: true
      },
      {
        productId: project2.id,
        type: 'max-boosted',
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days from now
        isActive: true
      }
    ]
    
    for (const promotion of promotions) {
      await prisma.promotion.create({ data: promotion })
    }
    
    console.log('✅ Created 2 dummy promotions')
    
    // Reset boost sales to current month
    console.log('📊 Resetting boost sales...')
    
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
    
    const boostSales = [
      {
        month: currentMonth,
        planType: 'boosted',
        soldCount: 12,
        maxSpots: 50,
        isActive: true
      },
      {
        month: currentMonth,
        planType: 'max-boosted',
        soldCount: 8,
        maxSpots: 25,
        isActive: true
      },
      {
        month: currentMonth,
        planType: 'points',
        soldCount: 25,
        maxSpots: 100,
        isActive: true
      }
    ]
    
    for (const sale of boostSales) {
      await prisma.boostSales.create({ data: sale })
    }
    
    console.log('✅ Reset boost sales data')
    
    // Create dummy updates
    console.log('📝 Creating dummy updates...')
    
    const updates = [
      {
        title: 'Major UI/UX Overhaul',
        content: 'We\'ve completely redesigned the interface based on user feedback. The new design is more intuitive and mobile-friendly.',
        productId: project1.id,
        userId: user1.id
      },
      {
        title: 'AI Integration Released',
        content: 'Our new AI-powered features are now live! The system can now automatically prioritize tasks and suggest optimal workflows.',
        productId: project1.id,
        userId: user1.id
      },
      {
        title: 'Carbon Tracking API Launch',
        content: 'We\'ve launched our public API for carbon tracking. Developers can now integrate EcoTracker into their own applications.',
        productId: project2.id,
        userId: user2.id
      },
      {
        title: 'Machine Learning Model Update',
        content: 'Our AI mentor has been trained on the latest programming patterns and can now provide even more accurate suggestions.',
        productId: project3.id,
        userId: user3.id
      }
    ]
    
    for (const update of updates) {
      await prisma.update.create({ data: update })
    }
    
    console.log('✅ Created 4 dummy updates')
    
    console.log('\n🎉 Complete data reset finished!')
    console.log('\n📊 Summary:')
    console.log('  👥 Users: 3')
    console.log('  🚀 Projects: 5')
    console.log('  💬 Comments: 10')
    console.log('  👍 Votes: 10')
    console.log('  🚀 Promotions: 2')
    console.log('  📝 Updates: 4')
    console.log('  📊 Boost Sales: Reset to current month')
    console.log('\n🔑 Demo Account: demo@startuppush.com')
    console.log('💰 Points: 150, 75, 200 (for each user)')
    
  } catch (error) {
    console.error('❌ Error during reset:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAllData()
