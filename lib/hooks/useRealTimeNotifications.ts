import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useNotificationStore } from '@/lib/notification-store'

export function useRealTimeNotifications() {
  const { data: session } = useSession()
  const { addNotification } = useNotificationStore()
  const lastNotificationId = useRef<string | null>(null)

  useEffect(() => {
    if (!session?.user) return

    const fetchLatestNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=1')
        if (response.ok) {
          const data = await response.json()
          const latestNotification = data.notifications[0]
          
          if (latestNotification && latestNotification.id !== lastNotificationId.current) {
            // This is a new notification
            lastNotificationId.current = latestNotification.id
            
            // Add to store if it's an admin notification and not already read
            if ((latestNotification.type.includes('PROJECT_') || latestNotification.type.includes('COMMENT_')) && !latestNotification.isRead) {
              addNotification(latestNotification)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching latest notifications:', error)
      }
    }

    // Check for new notifications every 3 seconds
    const interval = setInterval(fetchLatestNotifications, 3000)
    
    return () => clearInterval(interval)
  }, [session?.user, addNotification])

  return null
}
