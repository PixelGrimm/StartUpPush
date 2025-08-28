const fs = require('fs');
const path = require('path');

console.log('Setting up PostgreSQL schema for production...');

// Update schema to use PostgreSQL for production
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Replace SQLite with PostgreSQL
schemaContent = schemaContent.replace(
  'provider = "sqlite"',
  'provider = "postgresql"'
);

fs.writeFileSync(schemaPath, schemaContent);

console.log('✅ PostgreSQL schema setup complete!');
console.log('🚀 Ready for production deployment on Railway');
