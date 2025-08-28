const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up local SQLite database for development...');

// Set environment variable for local SQLite
process.env.DATABASE_URL = 'file:./dev.db';

// Update schema to use SQLite for local development
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Replace PostgreSQL with SQLite
schemaContent = schemaContent.replace(
  'provider = "postgresql"',
  'provider = "sqlite"'
);

fs.writeFileSync(schemaPath, schemaContent);

try {
  // Push the schema to create/update the local database
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
  });
  
  console.log('✅ Local SQLite database setup complete!');
  console.log('📝 Note: Remember to change schema back to PostgreSQL before deploying to Railway');
  
} catch (error) {
  console.error('❌ Error setting up local database:', error.message);
  process.exit(1);
}
