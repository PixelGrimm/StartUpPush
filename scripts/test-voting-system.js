const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVotingSystem() {
  try {
    console.log('🧪 Testing Voting and Points System...\n')
    
    // 1. Check current users and their points
    console.log('📊 Current Users and Points:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        points: true,
        _count: {
          select: {
            votes: true,
            products: true
          }
        }
      }
    })
    
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name}): ${user.points} points, ${user._count.votes} votes, ${user._count.products} products`)
    })
    
    // 2. Check current products and their votes
    console.log('\n📊 Current Products and Votes:')
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        userId: true,
        user: {
          select: {
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            votes: true
          }
        },
        votes: {
          select: {
            value: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })
    
    products.forEach(product => {
      const upvotes = product.votes.filter(v => v.value === 1).length
      const downvotes = product.votes.filter(v => v.value === -1).length
      const totalVotes = upvotes + downvotes
      const netVotes = upvotes - downvotes
      
      console.log(`  - ${product.name} (by ${product.user.email}):`)
      console.log(`    Total votes: ${totalVotes} (${upvotes} up, ${downvotes} down, net: ${netVotes})`)
      
      if (product.votes.length > 0) {
        console.log(`    Voters: ${product.votes.map(v => `${v.user.email}(${v.value > 0 ? '+' : ''}${v.value})`).join(', ')}`)
      }
    })
    
    // 3. Check all votes in the system
    console.log('\n📊 All Votes in System:')
    const allVotes = await prisma.vote.findMany({
      select: {
        id: true,
        value: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            points: true
          }
        },
        product: {
          select: {
            name: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    allVotes.forEach(vote => {
      console.log(`  - ${vote.user.email} voted ${vote.value > 0 ? '+' : ''}${vote.value} on "${vote.product.name}" (by ${vote.product.user.email}) at ${vote.createdAt.toISOString()}`)
    })
    
    // 4. Test voting logic simulation
    console.log('\n🧮 Testing Voting Logic:')
    
    if (users.length >= 2 && products.length >= 1) {
      const voter = users[0]
      const product = products[0]
      
      console.log(`\nSimulating vote by ${voter.email} on ${product.name}:`)
      
      // Check if user already voted
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_productId: {
            userId: voter.id,
            productId: product.id
          }
        }
      })
      
      if (existingVote) {
        console.log(`  ❌ ${voter.email} already voted ${existingVote.value > 0 ? '+' : ''}${existingVote.value} on this product`)
        console.log(`  ✅ This is correct - votes are permanent and cannot be changed`)
      } else {
        console.log(`  ✅ ${voter.email} can vote on this product`)
        
        // Simulate upvote
        console.log(`  📝 Simulating upvote (+1) by ${voter.email} on ${product.name}:`)
        console.log(`    - Voter current points: ${voter.points}`)
        console.log(`    - Product current votes: ${product._count.votes}`)
        
        if (voter.id !== product.userId) {
          console.log(`    - Voter would get +1 point for upvoting someone else's product`)
          console.log(`    - Product would get +10 points for upvote`)
        } else {
          console.log(`    - Voter is voting on their own product (no points awarded to voter)`)
          console.log(`    - Product would get +10 points for upvote`)
        }
      }
    }
    
    // 5. Check points distribution
    console.log('\n💰 Points Distribution Analysis:')
    const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
    const totalVotes = allVotes.length
    const upvotes = allVotes.filter(v => v.value === 1).length
    const downvotes = allVotes.filter(v => v.value === -1).length
    
    console.log(`  Total points in system: ${totalPoints}`)
    console.log(`  Total votes: ${totalVotes} (${upvotes} upvotes, ${downvotes} downvotes)`)
    
    // Calculate expected points from voting
    const expectedPointsFromVoting = upvotes - downvotes // +1 for upvote, -1 for downvote
    console.log(`  Expected points from voting: ${expectedPointsFromVoting}`)
    
    // Check for any discrepancies
    const discrepancy = totalPoints - expectedPointsFromVoting
    if (discrepancy !== 0) {
      console.log(`  ⚠️  Points discrepancy: ${discrepancy} (might be from other sources like initial points, boosts, etc.)`)
    } else {
      console.log(`  ✅ Points match expected voting totals`)
    }
    
    // 6. Test vote constraints
    console.log('\n🔒 Testing Vote Constraints:')
    
    // Check unique constraint
    const duplicateVotes = await prisma.$queryRaw`
      SELECT userId, productId, COUNT(*) as count
      FROM Vote
      GROUP BY userId, productId
      HAVING COUNT(*) > 1
    `
    
    if (duplicateVotes.length > 0) {
      console.log(`  ❌ Found duplicate votes: ${duplicateVotes.length} violations`)
      duplicateVotes.forEach(dv => {
        console.log(`    - User ${dv.userId} has ${dv.count} votes on product ${dv.productId}`)
      })
    } else {
      console.log(`  ✅ No duplicate votes found (unique constraint working)`)
    }
    
    // 7. Check for users with negative points
    console.log('\n📉 Users with Low/Zero Points:')
    const lowPointsUsers = users.filter(u => u.points <= 0)
    if (lowPointsUsers.length > 0) {
      lowPointsUsers.forEach(user => {
        console.log(`  - ${user.email}: ${user.points} points`)
        if (user.points < 0) {
          console.log(`    ⚠️  Negative points detected!`)
        }
      })
    } else {
      console.log(`  ✅ All users have positive points`)
    }
    
    console.log('\n✅ Voting and Points System Test Complete!')
    
  } catch (error) {
    console.error('❌ Error testing voting system:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testVotingSystem()
