const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAdminButtons() {
  try {
    console.log('🧪 Testing Admin Button Logic...\n')

    // Get all projects with their status
    const projects = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('📦 Projects and their button logic:')
    projects.forEach((project, index) => {
      console.log(`${index + 1}. "${project.name}"`)
      console.log(`   Status: ${project.status}`)
      console.log(`   By: ${project.user.name}`)
      
      if (project.status === 'active') {
        console.log(`   ✅ Should show: Jail + Delete buttons`)
        console.log(`   ❌ Should NOT show: Approve button`)
      } else if (project.status === 'jailed') {
        console.log(`   ✅ Should show: Approve + Delete buttons`)
        console.log(`   ❌ Should NOT show: Jail button`)
      }
      console.log('')
    })

    // Get all comments with their status
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('💬 Comments and their button logic:')
    comments.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment.content.substring(0, 50)}..."`)
      console.log(`   Status: ${comment.status}`)
      console.log(`   By: ${comment.user.name}`)
      console.log(`   On: ${comment.product.name}`)
      
      if (comment.status === 'active') {
        console.log(`   ✅ Should show: Jail + Delete buttons`)
        console.log(`   ❌ Should NOT show: Approve button`)
      } else if (comment.status === 'jailed') {
        console.log(`   ✅ Should show: Approve + Delete buttons`)
        console.log(`   ❌ Should NOT show: Jail button`)
      }
      console.log('')
    })

    // Count by status
    const activeProjects = projects.filter(p => p.status === 'active').length
    const jailedProjects = projects.filter(p => p.status === 'jailed').length
    const activeComments = comments.filter(c => c.status === 'active').length
    const jailedComments = comments.filter(c => c.status === 'jailed').length

    console.log('📊 Summary:')
    console.log(`   Active Projects: ${activeProjects} (should show Jail + Delete)`)
    console.log(`   Jailed Projects: ${jailedProjects} (should show Approve + Delete)`)
    console.log(`   Active Comments: ${activeComments} (should show Jail + Delete)`)
    console.log(`   Jailed Comments: ${jailedComments} (should show Approve + Delete)`)
    console.log('')

    console.log('🎯 EXPECTED BEHAVIOR:')
    console.log('   ✅ Active items: Only Jail + Delete buttons')
    console.log('   ✅ Jailed items: Only Approve + Delete buttons')
    console.log('   ✅ No Approve buttons on active items')
    console.log('   ✅ No Jail buttons on jailed items')
    console.log('')

    console.log('🧪 TESTING INSTRUCTIONS:')
    console.log('1. Go to admin dashboard')
    console.log('2. Check Projects tab - active projects should only show Jail + Delete')
    console.log('3. Check Comments tab - active comments should only show Jail + Delete')
    console.log('4. Check Jail tab - jailed items should only show Release + Delete')
    console.log('5. Verify no Approve buttons on active items')

  } catch (error) {
    console.error('❌ Error testing admin buttons:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminButtons()
