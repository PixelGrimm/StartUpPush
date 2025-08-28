// List of bad words to flag content
const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss', 'dick', 'cock',
  'pussy', 'cunt', 'whore', 'slut', 'bastard', 'motherfucker', 'fucker', 'fucking',
  'shitty', 'asshole', 'dumbass', 'jackass', 'dickhead', 'prick', 'twat', 'wanker',
  'bullshit', 'horseshit', 'fuckoff', 'fuckyou', 'fuckoff', 'fuckyou', 'fuckoff',
  'wtf', 'what the fuck', 'what the hell', 'what the shit',
  // Add more as needed
]

// Function to check if content contains bad words
function containsBadWords(content) {
  const lowerContent = content.toLowerCase()
  return BAD_WORDS.some(word => lowerContent.includes(word))
}

// Function to get the bad words found in content
function getBadWordsInContent(content) {
  const lowerContent = content.toLowerCase()
  return BAD_WORDS.filter(word => lowerContent.includes(word))
}

// Function to check if content should be automatically jailed
function shouldAutoJail(content) {
  return containsBadWords(content)
}

module.exports = {
  containsBadWords,
  getBadWordsInContent,
  shouldAutoJail
}
