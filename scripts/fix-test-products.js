const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixTestProducts() {
  try {
    console.log('🧹 Cleaning up and recreating test products...\n')
    
    // Delete existing test products
    await prisma.vote.deleteMany({
      where: {
        product: {
          OR: [
            { name: { contains: 'Averi' } },
            { name: { contains: 'fuck' } }
          ]
        }
      }
    })
    
    await prisma.product.deleteMany({
      where: {
        OR: [
          { name: { contains: 'Averi' } },
          { name: { contains: 'fuck' } }
        ]
      }
    })
    
    console.log('✅ Deleted existing test products')
    
    // Get a user to create products for
    const user = await prisma.user.findFirst({
      where: { email: 'alexszabo89@icloud.com' }
    })
    
    if (!user) {
      console.log('❌ No user found to create products for')
      return
    }
    
    // Get other users to create votes
    const otherUsers = await prisma.user.findMany({
      where: {
        email: { not: 'alexszabo89@icloud.com' }
      },
      take: 15
    })
    
    console.log(`Found ${otherUsers.length} users for voting`)
    
    // Create Averi AI product
    const averiAI = await prisma.product.create({
      data: {
        name: 'Averi AI',
        tagline: 'The AI Marketing Workspace: Strategy, Content, Team in One',
        description: 'Averi AI is a comprehensive marketing workspace that combines strategy, content creation, and team collaboration in one powerful platform.',
        website: 'https://averi.ai',
        category: 'AI Tools',
        tags: 'AI Tools,Marketing,Content Creation',
        mrr: 5000,
        userId: user.id,
        logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
        ])
      }
    })
    
    console.log('✅ Created Averi AI product')
    
    // Create [@fuck.it] product
    const fuckIt = await prisma.product.create({
      data: {
        name: '[@fuck.it] - Email with Attitude',
        tagline: 'Pure, secure and exclusive email with zero ads',
        description: 'A secure and private email service with zero advertisements and complete privacy protection.',
        website: 'https://fuck.it',
        category: 'Cybersecurity & Privacy',
        tags: 'Cybersecurity & Privacy,Email,Security',
        mrr: 2500,
        userId: user.id,
        logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
        ])
      }
    })
    
    console.log('✅ Created [@fuck.it] product')
    
    // Create votes for Averi AI (12 upvotes, 0 downvotes = 120 points)
    const averiVotes = []
    for (let i = 0; i < Math.min(12, otherUsers.length); i++) {
      averiVotes.push({
        value: 1,
        userId: otherUsers[i].id,
        productId: averiAI.id
      })
    }
    
    await prisma.vote.createMany({
      data: averiVotes
    })
    
    console.log(`✅ Added ${averiVotes.length} upvotes to Averi AI (${averiVotes.length * 10} points)`)
    
    // Create votes for [@fuck.it] (13 upvotes, 0 downvotes = 130 points)
    const fuckItVotes = []
    for (let i = 0; i < Math.min(13, otherUsers.length); i++) {
      fuckItVotes.push({
        value: 1,
        userId: otherUsers[i].id,
        productId: fuckIt.id
      })
    }
    
    await prisma.vote.createMany({
      data: fuckItVotes
    })
    
    console.log(`✅ Added ${fuckItVotes.length} upvotes to [@fuck.it] (${fuckItVotes.length * 10} points)`)
    
    // Verify the points calculation
    const products = await prisma.product.findMany({
      where: {
        id: { in: [averiAI.id, fuckIt.id] }
      },
      include: {
        votes: true
      }
    })
    
    console.log('\n📊 Points Verification:')
    products.forEach(product => {
      const upvotes = product.votes.filter(v => v.value === 1).length
      const downvotes = product.votes.filter(v => v.value === -1).length
      const points = (upvotes * 10) - (downvotes * 5)
      console.log(`  ${product.name}: ${upvotes} upvotes, ${downvotes} downvotes = ${points} points`)
    })
    
    console.log('\n✅ Test products fixed successfully!')
    console.log('🌐 Visit http://localhost:3000 to see the updated cards')
    
  } catch (error) {
    console.error('❌ Error fixing test products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixTestProducts()
