import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'comment' | 'vote' | 'follow' | 'product_update' | 'system'
  title: string
  message: string
  productId?: string
  productName?: string
  userId?: string
  userName?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: '1',
      type: 'comment',
      title: 'New comment on your product',
      message: 'Sarah Chen commented on "AI Writer Pro"',
      productId: 'ai-writer-pro',
      productName: 'AI Writer Pro',
      userId: 'sarah-chen',
      userName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: '/p/ai-writer-pro'
    },
    {
      id: '2',
      type: 'vote',
      title: 'New upvote received',
      message: 'Marcus Rodriguez upvoted "AI Writer Pro"',
      productId: 'ai-writer-pro',
      productName: 'AI Writer Pro',
      userId: 'marcus-rodriguez',
      userName: 'Marcus Rodriguez',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: '/p/ai-writer-pro'
    },
    {
      id: '3',
      type: 'follow',
      title: 'New follower',
      message: 'Alex Thompson started following "AI Writer Pro"',
      productId: 'ai-writer-pro',
      productName: 'AI Writer Pro',
      userId: 'alex-thompson',
      userName: 'Alex Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionUrl: '/p/ai-writer-pro'
    },
    {
      id: '4',
      type: 'comment',
      title: 'New comment on followed product',
      message: 'Priya Patel commented on "ChatGPT Assistant"',
      productId: 'chatgpt-assistant',
      productName: 'ChatGPT Assistant',
      userId: 'priya-patel',
      userName: 'Priya Patel',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      actionUrl: '/p/chatgpt-assistant'
    }
  ],
  unreadCount: 2,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
  },

  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
      const unreadCount = updatedNotifications.filter(n => !n.read).length
      
      return {
        notifications: updatedNotifications,
        unreadCount
      }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      unreadCount: 0
    }))
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id)
      const wasUnread = notification && !notification.read
      
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
      }
    })
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0
    })
  }
}))

// Helper functions for creating specific notification types
export const createCommentNotification = (
  productId: string,
  productName: string,
  userId: string,
  userName: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'comment',
    title: 'New comment on your product',
    message: `${userName} commented on "${productName}"`,
    productId,
    productName,
    userId,
    userName,
    actionUrl: `/p/${productId}`
  })
}

export const createVoteNotification = (
  productId: string,
  productName: string,
  userId: string,
  userName: string,
  voteType: 'upvote' | 'downvote'
) => {
  useNotificationStore.getState().addNotification({
    type: 'vote',
    title: `New ${voteType} received`,
    message: `${userName} ${voteType}d "${productName}"`,
    productId,
    productName,
    userId,
    userName,
    actionUrl: `/p/${productId}`
  })
}

export const createFollowNotification = (
  productId: string,
  productName: string,
  userId: string,
  userName: string
) => {
  useNotificationStore.getState().addNotification({
    type: 'follow',
    title: 'New follower',
    message: `${userName} started following "${productName}"`,
    productId,
    productName,
    userId,
    userName,
    actionUrl: `/p/${productId}`
  })
}
