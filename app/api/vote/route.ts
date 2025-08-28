import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  console.log('Vote API called - starting...')
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Parsing request body...')
    const body = await request.json()
    const { productId, value } = body

    console.log('Vote request:', { productId, value, userEmail: session.user.email })

    if (!productId || !value || ![1, -1].includes(value)) {
      return NextResponse.json(
        { error: 'Invalid productId or vote value' },
        { status: 400 }
      )
    }

    console.log('Finding user...')
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    console.log('User found:', user?.email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json({ error: 'Your account has been banned' }, { status: 403 })
    }

    console.log('Finding project...')
    // Check if project exists
    const project = await prisma.product.findUnique({
      where: { id: productId }
    })
    console.log('Project found:', project?.name)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    console.log('Checking for existing vote...')
    // Check if user already voted on this project
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })
    console.log('Existing vote check completed')

    console.log('Existing vote found:', existingVote?.value)

    let pointsToAward = 0
    let pointsToDeduct = 0
    
    console.log('Processing vote logic...')

    if (existingVote) {
      // User already voted - return error, votes are permanent
      console.log('User already voted on this project - votes are permanent')
      return NextResponse.json(
        { error: 'You have already voted on this project. Votes are permanent and cannot be changed.' },
        { status: 400 }
      )
    } else {
      // New vote - create it
      await prisma.vote.create({
        data: {
          value,
          userId: user.id,
          productId: productId
        }
      })
      
      // Award points for upvote, deduct for downvote
      if (value === 1) {
        pointsToAward = 10 // Upvote gives 10 points to product
      } else {
        pointsToDeduct = 5 // Downvote takes 5 points from product
      }
    }

    // Award points to the voter (if voting on someone else's project) - only for new votes
    if (user.id !== project.userId) {
      console.log('Awarding points to voter for new vote...')
      let voterPointsToAward = 0
      
      if (value === 1) {
        voterPointsToAward = 1 // +1 point for upvoting someone else's product
      } else {
        voterPointsToAward = -1 // -1 point for downvoting someone else's product
      }
      
      // Check if user has enough points to downvote (can't go below 0)
      if (voterPointsToAward < 0) {
        const currentUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { points: true }
        })
        
        if (currentUser && currentUser.points <= 0) {
          console.log('User has 0 points, cannot downvote')
          return NextResponse.json(
            { error: 'You need at least 1 StartUpPush point to downvote' },
            { status: 400 }
          )
        }
      }
      
      // Award points to voter (simplified - no daily limit for now)
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          points: {
            increment: voterPointsToAward
          }
        },
        select: { points: true }
      })
      console.log(`Voter awarded ${voterPointsToAward} StartUpPush points. New total: ${updatedUser.points}`)
      
      // Create notification for the product owner
      try {
        await NotificationService.createVoteNotification(
          productId,
          user.id,
          project.userId,
          value
        )
      } catch (notificationError) {
        console.error('Error creating vote notification:', notificationError)
        // Don't fail the vote if notification fails
      }
    }

    console.log('Getting updated vote counts...')
    // Get updated vote counts
    const votes = await prisma.vote.findMany({
      where: { productId: productId }
    })

    const upvotes = votes.filter(v => v.value === 1).length
    const downvotes = votes.filter(v => v.value === -1).length
    const totalVotes = upvotes + downvotes // Show total votes, not net votes
    const netVotes = upvotes - downvotes // Keep net votes for other calculations
    console.log('Vote counts calculated:', { upvotes, downvotes, totalVotes, netVotes })

    // Calculate the final user vote state (permanent votes)
    const finalUserVote = value

    console.log('Vote response:', { 
      upvotes, 
      downvotes, 
      totalVotes, 
      userVote: finalUserVote,
      pointsToAward,
      pointsToDeduct,
      newVoteValue: value
    })

    return NextResponse.json({
      success: true,
      totalVotes,
      upvotes,
      downvotes,
      userVote: finalUserVote
    })

  } catch (error) {
    console.error('Error voting:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
