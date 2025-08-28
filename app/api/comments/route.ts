import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/notification-service'
import { shouldAutoJail, getBadWordsInContent } from '@/lib/bad-words'

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

    // Content filtering - check for inappropriate content using bad words utility
    const hasInappropriateContent = shouldAutoJail(content)
    const badWordsFound = hasInappropriateContent ? getBadWordsInContent(content) : []
    
    // Set status based on content
    const commentStatus = hasInappropriateContent ? 'jailed' : 'active'

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
        status: commentStatus,
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

    // If comment was jailed due to bad words, create a notification for the user
    if (hasInappropriateContent) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'COMMENT_JAILED',
          title: 'Comment Under Review',
          message: `Your comment has been flagged for review due to inappropriate content. It will be reviewed by our team.`,
          isRead: false,
        }
      })
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
      comment,
      jailed: hasInappropriateContent,
      badWordsFound: badWordsFound,
      message: hasInappropriateContent 
        ? 'Comment submitted but flagged for review due to inappropriate content.' 
        : 'Comment submitted successfully!'
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
        parentId: null, // Only get top-level comments
        status: 'active' // Only show active comments
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
          where: {
            status: 'active' // Only show active replies
          },
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
