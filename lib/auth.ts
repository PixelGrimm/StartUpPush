import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️ Google OAuth credentials not configured. Google login will not work.')
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET not configured. Using fallback secret.')
}

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled due to type conflicts
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "test@example.com",
          pass: "test-password",
        },
      },
      from: "noreply@startuppush.pro",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // For development, we'll create a user and log the link
        // In production, you would send an actual email here
        try {
          // Check if user exists, if not create one
          let user = await prisma.user.findUnique({
            where: { email: identifier }
          })
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: identifier,
                name: identifier.split('@')[0],
                username: identifier.split('@')[0],
                isProfileComplete: false,
              }
            })
            console.log(`Created user: ${user.email}`)
          }
          
          // Create a custom URL with the correct callback
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const customUrl = url.replace(
            'callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsignin',
            'callbackUrl=' + encodeURIComponent(`${baseUrl}/auth/check-setup`)
          )
          
          console.log(`Sign-in link for ${identifier}: ${customUrl}`)
        } catch (error) {
          console.error('Error in sendVerificationRequest:', error)
        }
        
        return Promise.resolve()
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Credentials auth attempt:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            console.log('User not found or no password')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          console.log('Credentials auth successful for:', user.email, 'Profile complete:', user.isProfileComplete)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            isProfileComplete: user.isProfileComplete,
            points: user.points,
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      console.log('Session callback - Token:', token?.email, 'Profile complete:', token?.isProfileComplete)
      if (session?.user && token) {
        session.user.id = token.id
        session.user.isProfileComplete = token.isProfileComplete
        session.user.points = token.points
      }
      return session
    },
    jwt: async ({ token, user }) => {
      console.log('JWT callback - User:', user?.email, 'Profile complete:', user?.isProfileComplete)
      
      if (user) {
        // Initial authentication - update token with user data
        token.id = user.id
        token.isProfileComplete = user.isProfileComplete
        token.points = user.points
        console.log('JWT callback - Token updated with user data')
      } else if (token.email) {
        // Token refresh - fetch fresh user data from database
        try {
          const freshUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, email: true, isProfileComplete: true, points: true }
          })
          
          if (freshUser) {
            token.id = freshUser.id
            token.isProfileComplete = freshUser.isProfileComplete
            token.points = freshUser.points
            console.log('JWT callback - Token refreshed with fresh user data:', freshUser)
          }
        } catch (error) {
          console.error('Error fetching fresh user data:', error)
        }
      }
      
      console.log('JWT callback - Final token:', { id: token.id, email: token.email, isProfileComplete: token.isProfileComplete })
      return token
    },
    redirect: async ({ url, baseUrl }) => {
      console.log('NextAuth Redirect - URL:', url)
      console.log('NextAuth Redirect - BaseURL:', baseUrl)
      
      // After successful email authentication, redirect to check-setup
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log('NextAuth Redirect - Redirecting to check-setup')
        return `${baseUrl}/auth/check-setup`
      }
      
      // Handle email callback redirects
      if (url.includes('/api/auth/callback/email')) {
        console.log('NextAuth Redirect - Email callback, redirecting to check-setup')
        return `${baseUrl}/auth/check-setup`
      }
      
      // Don't redirect if already going to check-setup or other auth pages
      if (url.includes('/auth/') || url.includes('/password-setup') || url.includes('/profile-setup')) {
        console.log('NextAuth Redirect - Auth page, no redirect')
        return url
      }
      
      console.log('NextAuth Redirect - No redirect, returning:', url)
      return url
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
}
