const { spawn } = require('child_process')

console.log('🚀 Starting Railway application...')

// Run migration in background
console.log('📋 Running database migration...')
const migration = spawn('node', ['scripts/migrate-railway.js'], {
  stdio: 'inherit',
  detached: true
})

// Don't wait for migration to complete
migration.unref()

// Start the Next.js app
console.log('🌐 Starting Next.js application...')
const app = spawn('npm', ['start'], {
  stdio: 'inherit',
  detached: false
})

app.on('close', (code) => {
  console.log(`Next.js app exited with code ${code}`)
  process.exit(code)
})

app.on('error', (error) => {
  console.error('Failed to start Next.js app:', error)
  process.exit(1)
})
