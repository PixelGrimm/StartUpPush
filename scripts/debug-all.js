const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugAll() {
  console.log('🔍 Comprehensive Debug Report\n')

  try {
    // Check all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, isProfileComplete: true, points: true }
    })

    console.log('👥 All Users:')
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.name}) - ID: ${user.id} - Points: ${user.points} - Profile Complete: ${user.isProfileComplete}`)
    })

    // Check all products
    const allProducts = await prisma.product.findMany({
      include: {
        user: { select: { email: true, name: true } },
        votes: { select: { value: true } },
        comments: { select: { id: true, content: true, status: true } },
        _count: { select: { votes: true, comments: true } }
      }
    })

    console.log('\n📦 All Products:')
    allProducts.forEach(product => {
      const upvotes = product.votes.filter(v => v.value === 1).length
      const downvotes = product.votes.filter(v => v.value === -1).length
      const activeComments = product.comments.filter(c => c.status === 'active').length
      const jailedComments = product.comments.filter(c => c.status === 'jailed').length
      
      console.log(`   - ${product.name}`)
      console.log(`     Status: ${product.status} | Active: ${product.isActive}`)
      console.log(`     User: ${product.user.name} (${product.user.email})`)
      console.log(`     Votes: ${upvotes} up, ${downvotes} down`)
      console.log(`     Comments: ${activeComments} active, ${jailedComments} jailed`)
      console.log(`     Created: ${product.createdAt}`)
      console.log('')
    })

    // Check all comments
    const allComments = await prisma.comment.findMany({
      include: {
        user: { select: { email: true, name: true } },
        product: { select: { name: true } }
      }
    })

    console.log('💬 All Comments:')
    allComments.forEach(comment => {
      console.log(`   - "${comment.content.substring(0, 50)}..."`)
      console.log(`     Status: ${comment.status}`)
      console.log(`     User: ${comment.user.name} (${comment.user.email})`)
      console.log(`     Product: ${comment.product.name}`)
      console.log(`     Created: ${comment.createdAt}`)
      console.log('')
    })

    // Check boost sales
    const allBoostSales = await prisma.promotion.findMany({
      include: {
        product: { select: { name: true } }
      }
    })

    console.log('🚀 All Boost Sales:')
    allBoostSales.forEach(boost => {
      console.log(`   - ${boost.type} boost`)
      console.log(`     Product: ${boost.product.name}`)
      console.log(`     Amount: $${boost.amount}`)
      console.log(`     Active: ${boost.isActive}`)
      console.log(`     Created: ${boost.createdAt}`)
      console.log('')
    })

    // Check votes
    const allVotes = await prisma.vote.findMany({
      include: {
        user: { select: { email: true, name: true } },
        product: { select: { name: true } }
      }
    })

    console.log('🗳️ All Votes:')
    allVotes.forEach(vote => {
      console.log(`   - ${vote.user.name} ${vote.value === 1 ? 'upvoted' : 'downvoted'} ${vote.product.name}`)
    })

    // Summary
    console.log('\n📊 Summary:')
    console.log(`   Users: ${allUsers.length}`)
    console.log(`   Products: ${allProducts.length}`)
    console.log(`   Comments: ${allComments.length}`)
    console.log(`   Boost Sales: ${allBoostSales.length}`)
    console.log(`   Votes: ${allVotes.length}`)

    // Check for issues
    console.log('\n⚠️ Potential Issues:')
    
    const productsWithIssues = allProducts.filter(p => !p.isActive || p.status !== 'active')
    if (productsWithIssues.length > 0) {
      console.log(`   - ${productsWithIssues.length} products are not active`)
    }

    const commentsWithIssues = allComments.filter(c => c.status === 'jailed')
    if (commentsWithIssues.length > 0) {
      console.log(`   - ${commentsWithIssues.length} comments are jailed`)
    }

    const usersWithoutProfile = allUsers.filter(u => !u.isProfileComplete)
    if (usersWithoutProfile.length > 0) {
      console.log(`   - ${usersWithoutProfile.length} users have incomplete profiles`)
    }

    if (productsWithIssues.length === 0 && commentsWithIssues.length === 0 && usersWithoutProfile.length === 0) {
      console.log('   - No obvious issues found')
    }

    console.log('\n🎯 Next Steps:')
    console.log('1. Login as admin: alexszabo89@icloud.com / Sofia2022@@')
    console.log('2. Visit admin dashboard: http://localhost:3000/admin')
    console.log('3. Check if data appears after refresh')
    console.log('4. Try creating new content and see if it appears')

  } catch (error) {
    console.error('❌ Error during debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugAll()
