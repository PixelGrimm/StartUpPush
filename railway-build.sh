#!/bin/bash

# Railway build script for StartUpPush
echo "🚀 Starting Railway build for StartUpPush..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema (this will create tables if they don't exist)
echo "🗄️ Setting up database schema..."
npx prisma db push

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Railway build completed successfully!"
