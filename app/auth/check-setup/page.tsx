"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CheckSetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    // Check user setup status and redirect accordingly
    checkUserSetup()
  }, [session, status, router])

  const checkUserSetup = async () => {
    try {
      // Check if profile is complete
      if (!session?.user?.isProfileComplete) {
        router.push('/profile-setup')
        return
      }

      // Check if user has a password
      const response = await fetch('/api/user/has-password')
      if (response.ok) {
        const data = await response.json()
        if (!data.hasPassword) {
          // If no password, redirect to profile setup (which now includes password)
          router.push('/profile-setup')
          return
        }
      }

      // User has complete profile and password, redirect to home
      router.push('/')
    } catch (error) {
      console.error('Error checking user setup:', error)
      // If there's an error, redirect to profile setup to be safe
      router.push('/profile-setup')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}
