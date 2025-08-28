import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/notification-service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { action } = await request.json()

    if (!['approve', 'jail', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get the comment first to get user info for notifications
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (action === 'delete') {
      // Delete the comment
      await prisma.comment.delete({ where: { id } })

      // Send notification to user that their comment was deleted
      try {
        await NotificationService.createAdminActionNotification(
          comment.user.id,
          'COMMENT_DELETED',
          'Comment Deleted',
          `Your comment on "${comment.product.name}" has been permanently deleted by our moderation team.`,
          comment.product.id,
          comment.id
        )
      } catch (notificationError) {
        console.error('Error creating comment deletion notification:', notificationError)
      }
    } else {
      // Update comment status
      const status = action === 'approve' ? 'active' : 'jailed'
      await prisma.comment.update({
        where: { id },
        data: { status }
      })

      // Send notification to user about the action
      try {
        if (action === 'approve') {
          await NotificationService.createAdminActionNotification(
            comment.user.id,
            'COMMENT_APPROVED',
            'Comment Approved',
            `Your comment on "${comment.product.name}" has been approved and is now visible!`,
            comment.product.id,
            comment.id
          )
        } else if (action === 'jail') {
          await NotificationService.createAdminActionNotification(
            comment.user.id,
            'COMMENT_JAILED',
            'Comment Under Review',
            `Your comment on "${comment.product.name}" has been flagged for review by our moderation team.`,
            comment.product.id,
            comment.id
          )
        }
      } catch (notificationError) {
        console.error('Error creating comment action notification:', notificationError)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
