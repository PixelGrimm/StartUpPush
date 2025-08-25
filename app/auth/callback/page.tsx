"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('Auth Callback - Status:', status)
    console.log('Auth Callback - Session:', session)
    console.log('Auth Callback - Search Params:', searchParams.toString())

    if (status === 'loading') return

    if (status === 'authenticated' && session?.user) {
      console.log('Auth Callback - User authenticated, checking profile completion')
      
      // Check if user has a complete profile
      if (session.user.isProfileComplete) {
        console.log('Auth Callback - Profile complete, redirecting to home')
        router.push('/')
      } else {
        console.log('Auth Callback - Profile incomplete, redirecting to profile setup')
        router.push('/profile-setup')
      }
    } else if (status === 'unauthenticated') {
      console.log('Auth Callback - User not authenticated, redirecting to signin')
      router.push('/auth/signin')
    }
  }, [session, status, router, searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  )
}
