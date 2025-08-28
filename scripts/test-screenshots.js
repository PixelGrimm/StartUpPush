const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testScreenshots() {
  try {
    console.log('🔍 Testing screenshot functionality...\n')
    
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        screenshots: true,
        logo: true
      }
    })
    
    console.log(`📊 Found ${products.length} products:\n`)
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   - Has logo: ${product.logo ? 'Yes' : 'No'}`)
      console.log(`   - Has screenshots field: ${product.screenshots ? 'Yes' : 'No'}`)
      
      if (product.screenshots) {
        try {
          const parsedScreenshots = JSON.parse(product.screenshots)
          console.log(`   - Screenshots parsed: ${parsedScreenshots.length} items`)
          console.log(`   - First screenshot type: ${parsedScreenshots[0]?.substring(0, 30)}...`)
        } catch (error) {
          console.log(`   - Error parsing screenshots: ${error.message}`)
        }
      } else {
        console.log(`   - No screenshots data`)
      }
      console.log('')
    })
    
    // Test creating a sample product with screenshots
    console.log('🧪 Testing screenshot creation...')
    
    const sampleScreenshots = [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    ]
    
    console.log(`   - Sample screenshots created: ${sampleScreenshots.length} items`)
    console.log(`   - First sample: ${sampleScreenshots[0].substring(0, 30)}...`)
    
    // Test parsing the sample
    const testProduct = {
      name: 'Test Product',
      screenshots: JSON.stringify(sampleScreenshots)
    }
    
    console.log(`   - JSON stringified: ${testProduct.screenshots.substring(0, 50)}...`)
    
    const parsedBack = JSON.parse(testProduct.screenshots)
    console.log(`   - Parsed back: ${parsedBack.length} items`)
    
    console.log('\n✅ Screenshot functionality test completed!')
    
  } catch (error) {
    console.error('❌ Error testing screenshots:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testScreenshots()
