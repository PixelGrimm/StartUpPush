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

    // Get the project first to get user info for notifications
    const project = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (action === 'delete') {
      // Delete the project and all related data
      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { productId: id } }),
        prisma.vote.deleteMany({ where: { productId: id } }),
        prisma.promotion.deleteMany({ where: { productId: id } }),
        prisma.product.delete({ where: { id } })
      ])

      // Send notification to user that their project was deleted
      try {
        await NotificationService.createAdminActionNotification(
          project.user.id,
          'PROJECT_DELETED',
          'Project Deleted',
          `Your project "${project.name}" has been permanently deleted by our moderation team.`,
          project.id
        )
      } catch (notificationError) {
        console.error('Error creating deletion notification:', notificationError)
      }
    } else {
      // Update project status
      const status = action === 'approve' ? 'active' : 'jailed'
      await prisma.product.update({
        where: { id },
        data: { status }
      })

      // Send notification to user about the action
      try {
        if (action === 'approve') {
          await NotificationService.createAdminActionNotification(
            project.user.id,
            'PROJECT_APPROVED',
            'Project Approved',
            `Your project "${project.name}" has been approved and is now live on the platform!`,
            project.id
          )
        } else if (action === 'jail') {
          await NotificationService.createAdminActionNotification(
            project.user.id,
            'PROJECT_JAILED',
            'Project Under Review',
            `Your project "${project.name}" has been flagged for review by our moderation team.`,
            project.id
          )
        }
      } catch (notificationError) {
        console.error('Error creating project action notification:', notificationError)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
