const fetch = require('node-fetch')

async function testVoteAPI() {
  console.log('🧪 Testing Vote API...\n')
  
  const baseURL = 'http://localhost:3000'
  
  try {
    // Test 1: Try to vote without authentication
    console.log('1️⃣ Testing vote without authentication...')
    try {
      const response = await fetch(`${baseURL}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
          value: 1
        })
      })
      
      const data = await response.json()
      console.log(`   Status: ${response.status}`)
      console.log(`   Response: ${JSON.stringify(data)}`)
      
      if (response.status === 401) {
        console.log('   ✅ Correctly rejected unauthenticated vote')
      } else {
        console.log('   ❌ Should have rejected unauthenticated vote')
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Test 2: Try to vote with invalid data
    console.log('\n2️⃣ Testing vote with invalid data...')
    try {
      const response = await fetch(`${baseURL}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'invalid-product-id',
          value: 2 // Invalid vote value
        })
      })
      
      const data = await response.json()
      console.log(`   Status: ${response.status}`)
      console.log(`   Response: ${JSON.stringify(data)}`)
      
      if (response.status === 400) {
        console.log('   ✅ Correctly rejected invalid vote data')
      } else {
        console.log('   ❌ Should have rejected invalid vote data')
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Test 3: Get current products to test with
    console.log('\n3️⃣ Getting current products for testing...')
    try {
      const response = await fetch(`${baseURL}/api/products`)
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        console.log(`   Found ${data.products.length} products`)
        data.products.slice(0, 3).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} (ID: ${product.id}) - Votes: ${product.totalVotes || 0}`)
        })
      } else {
        console.log('   ❌ No products found')
        return
      }
    } catch (error) {
      console.log(`   ❌ Error fetching products: ${error.message}`)
      return
    }
    
    // Test 4: Test user votes endpoint
    console.log('\n4️⃣ Testing user votes endpoint...')
    try {
      const response = await fetch(`${baseURL}/api/user/votes`)
      const data = await response.json()
      
      console.log(`   Status: ${response.status}`)
      if (response.status === 401) {
        console.log('   ✅ Correctly requires authentication')
      } else {
        console.log(`   Response: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log('\n✅ Vote API Test Complete!')
    console.log('\n📝 Note: To test authenticated voting, you need to:')
    console.log('   1. Sign in to the application')
    console.log('   2. Navigate to a product page')
    console.log('   3. Click the upvote/downvote buttons')
    console.log('   4. Check the browser console for API responses')
    
  } catch (error) {
    console.error('❌ Error testing vote API:', error)
  }
}

// Run the test
testVoteAPI()
