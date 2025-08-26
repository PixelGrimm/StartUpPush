#!/bin/bash

# Railway build script for StartUpPush
echo "🚀 Starting Railway build for StartUpPush..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Railway build completed successfully!"
echo "📝 Database setup will happen during deployment..."
