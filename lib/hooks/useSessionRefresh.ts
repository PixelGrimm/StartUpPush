import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useSessionRefresh() {
  const { data: session, update } = useSession()

  const refreshSession = async () => {
    try {
      await update()
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  return { session, refreshSession }
}
