import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user with points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        products: {
          select: {
            id: true,
            name: true,
            tagline: true,
            website: true,
            isPromoted: true,
            mrr: true,
            logo: true,
            screenshots: true,
            createdAt: true,
            _count: {
              select: {
                votes: true,
                comments: true,
              },
            },
          },
        },
        votes: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse screenshots for each product
    const productsWithScreenshots = user.products.map(product => {
      let screenshots = []
      if (product.screenshots) {
        try {
          screenshots = JSON.parse(product.screenshots)
        } catch (error) {
          console.error('Error parsing screenshots for product:', product.id, error)
          screenshots = []
        }
      }
      return {
        ...product,
        screenshots
      }
    })

    const stats = {
      points: user.points,
      productsCount: user.products.length,
      totalVotes: user.votes.length,
      products: productsWithScreenshots,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}
