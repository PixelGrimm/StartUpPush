import { prisma } from './prisma'

export interface CreateNotificationParams {
  type: 'comment' | 'reply' | 'vote' | 'update' | 'PROJECT_APPROVED' | 'PROJECT_JAILED' | 'PROJECT_DELETED' | 'COMMENT_APPROVED' | 'COMMENT_JAILED' | 'COMMENT_DELETED'
  userId: string
  productId?: string
  commentId?: string
  fromUserId?: string
  title: string
  message: string
}

export class NotificationService {
  static async createNotification(params: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: {
          type: params.type,
          userId: params.userId,
          productId: params.productId,
          commentId: params.commentId,
          fromUserId: params.fromUserId,
          title: params.title,
          message: params.message,
        },
      })

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  static async createCommentNotification(
    productId: string,
    commentId: string,
    fromUserId: string,
    productOwnerId: string
  ) {
    // Don't notify if the commenter is the product owner
    if (fromUserId === productOwnerId) return

    const [product, fromUser] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, username: true },
      }),
    ])

    if (!product || !fromUser) return

    const userName = fromUser.name || fromUser.username || 'Someone'

    await this.createNotification({
      type: 'comment',
      userId: productOwnerId,
      productId,
      commentId,
      fromUserId,
      title: 'New comment on your project',
      message: `${userName} commented on your project "${product.name}"`,
    })
  }

  static async createReplyNotification(
    productId: string,
    commentId: string,
    fromUserId: string,
    parentCommentId: string
  ) {
    // Get the parent comment to find who to notify
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
      select: { userId: true },
    })

    if (!parentComment || parentComment.userId === fromUserId) return

    const [product, fromUser] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, username: true },
      }),
    ])

    if (!product || !fromUser) return

    const userName = fromUser.name || fromUser.username || 'Someone'

    await this.createNotification({
      type: 'reply',
      userId: parentComment.userId,
      productId,
      commentId,
      fromUserId,
      title: 'New reply to your comment',
      message: `${userName} replied to your comment on "${product.name}"`,
    })
  }

  static async createVoteNotification(
    productId: string,
    fromUserId: string,
    productOwnerId: string,
    voteValue: number
  ) {
    // Don't notify if the voter is the product owner
    if (fromUserId === productOwnerId) return

    const [product, fromUser] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, username: true },
      }),
    ])

    if (!product || !fromUser) return

    const userName = fromUser.name || fromUser.username || 'Someone'
    const voteType = voteValue > 0 ? 'upvoted' : 'downvoted'

    await this.createNotification({
      type: 'vote',
      userId: productOwnerId,
      productId,
      fromUserId,
      title: 'New vote on your project',
      message: `${userName} ${voteType} your project "${product.name}"`,
    })
  }

  static async createUpdateNotification(
    productId: string,
    updateId: string,
    fromUserId: string,
    productOwnerId: string
  ) {
    const [product, fromUser] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, username: true },
      }),
    ])

    if (!product || !fromUser) return

    const userName = fromUser.name || fromUser.username || 'Someone'

    await this.createNotification({
      type: 'update',
      userId: productOwnerId,
      productId,
      fromUserId,
      title: 'New project update',
      message: `${userName} posted an update for "${product.name}"`,
    })
  }

  // Convenience method for creating admin action notifications
  static async createAdminActionNotification(
    userId: string,
    type: 'PROJECT_APPROVED' | 'PROJECT_JAILED' | 'PROJECT_DELETED' | 'COMMENT_APPROVED' | 'COMMENT_JAILED' | 'COMMENT_DELETED',
    title: string,
    message: string,
    productId?: string,
    commentId?: string
  ) {
    return this.createNotification({
      type,
      userId,
      productId,
      commentId,
      title,
      message,
    })
  }
}
