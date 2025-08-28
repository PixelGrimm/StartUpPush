const { shouldAutoJail, getBadWordsInContent } = require('../lib/bad-words.js')

console.log('🧪 Testing Bad Words Detection System\n')

// Test cases
const testCases = [
  {
    content: 'This is a great product!',
    expected: false
  },
  {
    content: 'This product is fucking amazing!',
    expected: true
  },
  {
    content: 'I love this shit, it works perfectly',
    expected: true
  },
  {
    content: 'This is a normal comment without any issues',
    expected: false
  },
  {
    content: 'What the fuck is this?',
    expected: true
  },
  {
    content: 'This is a legitimate product review',
    expected: false
  }
]

console.log('📋 Test Results:\n')

testCases.forEach((testCase, index) => {
  const hasBadWords = shouldAutoJail(testCase.content)
  const badWordsFound = getBadWordsInContent(testCase.content)
  const passed = hasBadWords === testCase.expected
  
  console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'}`)
  console.log(`Content: "${testCase.content}"`)
  console.log(`Expected: ${testCase.expected ? 'Should jail' : 'Should allow'}`)
  console.log(`Result: ${hasBadWords ? 'Jailed' : 'Allowed'}`)
  if (badWordsFound.length > 0) {
    console.log(`Bad words found: ${badWordsFound.join(', ')}`)
  }
  console.log('')
})

console.log('🚀 Next Steps:')
console.log('1. Test product submission with bad words')
console.log('2. Test comment submission with bad words')
console.log('3. Check admin dashboard for jailed items')
console.log('4. Verify notifications are sent to users')
