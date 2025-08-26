import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, content, parentId } = body

    if (!productId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Product ID and comment content are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: user.id,
        productId: productId,
        parentId: parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    // Award +1 StartUpPush point for commenting (if commenting on someone else's product)
    if (user.id !== product.userId) {
      console.log('Awarding comment point to user...')
      
      // Check daily limit (max 20 points per day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const userCommentsToday = await prisma.comment.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: today
          }
        }
      })
      
      const pointsEarnedToday = userCommentsToday.length // Simple count for now
      
      if (pointsEarnedToday <= 20) { // <= 20 because we're about to add 1 more
        await prisma.user.update({
          where: { id: user.id },
          data: {
            points: {
              increment: 1
            }
          }
        })
        console.log('User awarded 1 StartUpPush point for commenting')
      } else {
        console.log('Daily limit reached, no points awarded for comment')
      }
    }

    // Create notification for the product owner (for new comments)
    if (!parentId) {
      try {
        await NotificationService.createCommentNotification(
          productId,
          comment.id,
          user.id,
          product.userId
        )
      } catch (notificationError) {
        console.error('Error creating comment notification:', notificationError)
        // Don't fail the comment if notification fails
      }
    } else {
      // Create notification for reply
      try {
        await NotificationService.createReplyNotification(
          productId,
          comment.id,
          user.id,
          parentId
        )
      } catch (notificationError) {
        console.error('Error creating reply notification:', notificationError)
        // Don't fail the comment if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      comment
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { 
        productId,
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      comments
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
