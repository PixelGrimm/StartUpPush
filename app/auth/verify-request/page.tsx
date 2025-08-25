"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyRequestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('Verify Request - Status:', status)
    console.log('Verify Request - Session:', session)
    console.log('Verify Request - Search Params:', searchParams.toString())

    if (status === 'loading') return

    if (status === 'authenticated' && session?.user) {
      console.log('Verify Request - User authenticated, checking profile completion')
      
      // Check if user has a complete profile
      if (session.user.isProfileComplete) {
        console.log('Verify Request - Profile complete, redirecting to home')
        router.push('/')
      } else {
        console.log('Verify Request - Profile incomplete, redirecting to profile setup')
        router.push('/profile-setup')
      }
    } else if (status === 'unauthenticated') {
      console.log('Verify Request - User not authenticated, redirecting to signin')
      router.push('/auth/signin')
    }
  }, [session, status, router, searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  )
}
