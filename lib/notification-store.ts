import { create } from 'zustand'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  productId?: string
  commentId?: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  setUnreadCount: (count: number) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationIds: string[]) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => set({ notifications }),
  
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  
  addNotification: (notification) => {
    const { notifications, unreadCount } = get()
    
    // Check if notification already exists to prevent duplicates
    const notificationExists = notifications.some(n => n.id === notification.id)
    if (notificationExists) {
      return
    }
    
    const newNotifications = [notification, ...notifications]
    const newUnreadCount = unreadCount + 1
    
    set({ 
      notifications: newNotifications,
      unreadCount: newUnreadCount
    })
    
    // Show toast notification for new admin notifications
    if (notification.type.includes('PROJECT_') || notification.type.includes('COMMENT_')) {
      // You can integrate with a toast library here
      console.log('New admin notification:', notification.title)
    }
  },
  
  markAsRead: (notificationIds) => {
    const { notifications, unreadCount } = get()
    const updatedNotifications = notifications.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isRead: true }
        : notification
    )
    const newUnreadCount = Math.max(0, unreadCount - notificationIds.length)
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: newUnreadCount
    })
    
    // Also update the backend to persist the read status
    fetch('/api/notifications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notificationIds }),
    }).catch(error => {
      console.error('Error marking notifications as read:', error)
    })
  },
  
  markAllAsRead: () => {
    const { notifications } = get()
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }))
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: 0
    })
    
    // Also update the backend to persist the read status
    fetch('/api/notifications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markAllAsRead: true }),
    }).catch(error => {
      console.error('Error marking all notifications as read:', error)
    })
  },
  
  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}))
