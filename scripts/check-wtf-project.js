const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkWtfProject() {
  try {
    console.log('🔍 Checking "wtf" Project...\n')

    // Find the project by name
    const project = await prisma.product.findFirst({
      where: { 
        name: 'wtf'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!project) {
      console.log('❌ Project "wtf" not found')
      return
    }

    console.log('📦 Project found:')
    console.log('   Name:', project.name)
    console.log('   Status:', project.status)
    console.log('   Active:', project.isActive)
    console.log('   User:', project.user?.name, `(${project.user?.email})`)
    console.log('   Created:', project.createdAt)
    console.log('   Description:', project.description)
    console.log('   Tagline:', project.tagline)

    // Check all projects with similar names
    const similarProjects = await prisma.product.findMany({
      where: {
        name: {
          contains: 'wtf'
        }
      },
      select: {
        id: true,
        name: true,
        status: true,
        isActive: true,
        createdAt: true
      }
    })

    console.log('\n🔍 Similar projects:')
    similarProjects.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - Status: ${p.status} - Active: ${p.isActive}`)
    })

  } catch (error) {
    console.error('❌ Error checking project:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkWtfProject()
