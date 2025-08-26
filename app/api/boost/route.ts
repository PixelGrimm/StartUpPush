import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Check if project exists and belongs to the user
    const project = await prisma.product.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or you do not own this project' },
        { status: 404 }
      )
    }

    // Check if user has enough points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    })

    if (!user || user.points < 50) {
      return NextResponse.json(
        { error: 'Insufficient points. You need 50 points to boost a product.' },
        { status: 400 }
      )
    }

    // Check if project is already boosted
    const existingBoost = await prisma.promotion.findFirst({
      where: {
        productId: projectId,
        type: 'boosted',
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    })

    if (existingBoost) {
      return NextResponse.json(
        { error: 'Project is already boosted' },
        { status: 400 }
      )
    }

    // Calculate boost duration (1 day from now)
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    // Create boost promotion and deduct points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from user
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { points: { decrement: 50 } },
        select: { points: true }
      })

      // Create boost promotion
      const boost = await tx.promotion.create({
        data: {
          productId: projectId,
          type: 'boosted',
          startDate: startDate,
          endDate: endDate,
          isActive: true
        }
      })

      return { updatedUser, boost }
    })

    return NextResponse.json({
      success: true,
      message: 'Project boosted successfully for 24 hours',
      boost: {
        id: result.boost.id,
        startDate: result.boost.startDate,
        endDate: result.boost.endDate,
        remainingPoints: result.updatedUser.points
      }
    })

  } catch (error) {
    console.error('Error boosting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Get active boost for the project
    const boost = await prisma.promotion.findFirst({
      where: {
        productId: projectId,
        type: 'boosted',
        isActive: true,
        endDate: {
          gt: new Date()
        }
      },
      orderBy: {
        endDate: 'desc'
      }
    })

    // Get user points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    })

    return NextResponse.json({
      boost: boost ? {
        id: boost.id,
        startDate: boost.startDate,
        endDate: boost.endDate,
        isActive: boost.isActive,
        timeRemaining: Math.max(0, boost.endDate.getTime() - Date.now())
      } : null,
      userPoints: user?.points || 0,
      canBoost: (user?.points || 0) >= 50 && !boost
    })

  } catch (error) {
    console.error('Error getting boost status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
