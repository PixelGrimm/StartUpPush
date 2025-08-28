import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.promotion.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.product.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create test users
  const testUsers = [
    {
      email: '123@123.com',
      name: '123',
      username: '123',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m', // password: 123
      points: 0,
      isProfileComplete: true
    },
    {
      email: 'john@example.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m',
      points: 0,
      isProfileComplete: true
    },
    {
      email: 'sarah@example.com',
      name: 'Sarah Wilson',
      username: 'sarahw',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m',
      points: 0,
      isProfileComplete: true
    },
    {
      email: 'mike@example.com',
      name: 'Mike Chen',
      username: 'mikechen',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8.m',
      points: 0,
      isProfileComplete: true
    }
  ]

  const users = []
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    })
    users.push(user)
    console.log(`👤 Created user: ${user.name}`)
  }

  // Create fresh products with unique names and data
  const products = [
    {
      name: 'TaskFlow Pro',
      tagline: 'Streamline your workflow with intelligent task management',
      description: 'TaskFlow Pro is a powerful project management tool that helps teams collaborate efficiently. Features include real-time updates, automated workflows, and comprehensive analytics.',
      website: 'https://taskflowpro.com',
      category: 'Productivity',
      tags: 'productivity,project-management,team-collaboration',
      mrr: 2500,
      userId: users[1].id
    },
    {
      name: 'DataViz Studio',
      tagline: 'Transform complex data into beautiful visualizations',
      description: 'DataViz Studio makes data visualization accessible to everyone. Create stunning charts, graphs, and dashboards with our intuitive drag-and-drop interface.',
      website: 'https://datavizstudio.com',
      category: 'Analytics',
      tags: 'analytics,data-visualization,business-intelligence',
      mrr: 1800,
      userId: users[2].id
    },
    {
      name: 'CloudSync Hub',
      tagline: 'Seamless cloud storage synchronization across all devices',
      description: 'CloudSync Hub provides automatic file synchronization across all your devices. Never lose important files again with our reliable cloud backup system.',
      website: 'https://cloudsynchub.com',
      category: 'Storage',
      tags: 'cloud-storage,file-sync,backup',
      mrr: 3200,
      userId: users[3].id
    },
    {
      name: 'CodeReview AI',
      tagline: 'AI-powered code review and quality assurance',
      description: 'CodeReview AI automatically analyzes your code for bugs, security vulnerabilities, and best practices. Improve code quality and reduce technical debt.',
      website: 'https://codereviewai.com',
      category: 'Development',
      tags: 'ai,code-review,software-development',
      mrr: 4200,
      userId: users[1].id
    },
    {
      name: 'SocialScheduler',
      tagline: 'Schedule and automate your social media presence',
      description: 'SocialScheduler helps you maintain a consistent social media presence by scheduling posts across multiple platforms. Track engagement and optimize your strategy.',
      website: 'https://socialscheduler.com',
      category: 'Marketing',
      tags: 'social-media,marketing,automation',
      mrr: 1500,
      userId: users[2].id
    },
    {
      name: 'InvoiceGenius',
      tagline: 'Generate professional invoices in seconds',
      description: 'InvoiceGenius automates the entire invoicing process. Create, send, and track invoices with our smart templates and payment integration.',
      website: 'https://invoicegenius.com',
      category: 'Finance',
      tags: 'invoicing,finance,business-tools',
      mrr: 2800,
      userId: users[3].id
    },
    {
      name: 'DesignCanvas',
      tagline: 'Create stunning designs with AI assistance',
      description: 'DesignCanvas combines human creativity with AI assistance to help you create professional designs quickly. Perfect for marketers, designers, and small businesses.',
      website: 'https://designcanvas.com',
      category: 'Design',
      tags: 'design,ai,creative-tools',
      mrr: 1900,
      userId: users[1].id
    },
    {
      name: 'HealthTracker',
      tagline: 'Monitor and improve your health with smart insights',
      description: 'HealthTracker helps you monitor your fitness goals, nutrition, and overall health. Get personalized insights and recommendations based on your data.',
      website: 'https://healthtracker.com',
      category: 'Health',
      tags: 'health,fitness,wellness',
      mrr: 1200,
      userId: users[2].id
    }
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop',
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1676299251956-4159187860d5?w=800&h=600&fit=crop'
        ])
      }
    })
    createdProducts.push(product)
    console.log(`📦 Created product: ${product.name}`)

    // Add automatic upvote from creator
    await prisma.vote.create({
      data: {
        userId: product.userId,
        productId: product.id,
        value: 1
      }
    })
  }

  // Create some blog posts
  const blogPosts = [
    {
      title: 'The Future of SaaS: Trends to Watch in 2024',
      slug: 'future-of-saas-trends-2024',
      content: 'The SaaS industry is evolving rapidly. Here are the key trends that will shape the future of software-as-a-service...',
      excerpt: 'Discover the emerging trends that will define the SaaS landscape in 2024 and beyond.',
      published: true,
      authorId: users[1].id
    },
    {
      title: 'Building a Successful Product Launch Strategy',
      slug: 'successful-product-launch-strategy',
      content: 'Launching a new product requires careful planning and execution. Learn the essential steps to ensure your product launch is successful...',
      excerpt: 'A comprehensive guide to planning and executing a successful product launch.',
      published: true,
      authorId: users[2].id
    }
  ]

  for (const postData of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData
    })
    console.log(`📝 Created blog post: ${postData.title}`)
  }

  // Create some test comments
  const comments = [
    {
      content: 'This looks really promising! I love the UI design.',
      userId: users[1].id,
      productId: createdProducts[0].id
    },
    {
      content: 'Great tool! Been using it for a month now.',
      userId: users[2].id,
      productId: createdProducts[0].id
    },
    {
      content: 'The pricing seems a bit high for what it offers.',
      userId: users[3].id,
      productId: createdProducts[1].id
    },
    {
      content: 'wtf is this?',
      userId: users[0].id,
      productId: createdProducts[1].id
    },
    {
      content: 'test comment',
      userId: users[0].id,
      productId: createdProducts[2].id
    },
    {
      content: 'hi there',
      userId: users[0].id,
      productId: createdProducts[2].id
    },
    {
      content: 'This is exactly what I was looking for!',
      userId: users[1].id,
      productId: createdProducts[3].id
    },
    {
      content: 'The integration with other tools is seamless.',
      userId: users[2].id,
      productId: createdProducts[4].id
    }
  ]

  for (const commentData of comments) {
    await prisma.comment.create({
      data: commentData
    })
    console.log(`💬 Created comment: ${commentData.content.substring(0, 30)}...`)
  }

  // Create some boost sales
  const boostSales = [
    {
      productId: createdProducts[0].id,
      type: 'boosted',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      productId: createdProducts[1].id,
      type: 'max-boosted',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      productId: createdProducts[2].id,
      type: 'boosted',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      isActive: false
    }
  ]

  for (const boostData of boostSales) {
    await prisma.promotion.create({
      data: boostData
    })
    console.log(`🚀 Created boost sale for product`)
  }

  // Add some votes
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)]
    
    await prisma.vote.upsert({
      where: {
        userId_productId: {
          userId: randomUser.id,
          productId: randomProduct.id
        }
      },
      update: {},
      create: {
        userId: randomUser.id,
        productId: randomProduct.id,
        value: Math.random() > 0.3 ? 1 : -1
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
