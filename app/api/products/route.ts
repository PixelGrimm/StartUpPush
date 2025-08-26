import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const featuredOnly = searchParams.get('featured') === 'true'
    
    // Get user votes if authenticated
    let userVotes: Record<string, number> = {}
    if (session?.user?.id) {
      console.log('Products API - Session user ID:', session.user.id)
      
      const votes = await prisma.vote.findMany({
        where: { userId: session.user.id },
        select: { productId: true, value: true }
      })
      
      console.log('Products API - User votes found:', votes.length)
      
      userVotes = votes.reduce((acc, vote) => {
        acc[vote.productId] = vote.value
        return acc
      }, {} as Record<string, number>)
    }

    // Fetch all products with votes and user data
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            points: true
          }
        },
        votes: {
          select: {
            value: true,
            userId: true
          }
        },
        promotions: {
          where: {
            type: 'boosted',
            isActive: true,
            endDate: {
              gt: new Date()
            }
          },
          orderBy: {
            endDate: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate points for each product based on votes
    const productsWithPoints = products.map(product => {
      const upvotes = product.votes.filter(vote => vote.value === 1).length
      const downvotes = product.votes.filter(vote => vote.value === -1).length
      const totalVotes = upvotes - downvotes
      const totalVoteCount = upvotes + downvotes // Total number of votes (for display)
      
      // Points should be based on the product's votes
      // Each upvote = +10 points, each downvote = -5 points
      const points = (upvotes * 10) - (downvotes * 5)
      
      // Debug vote counts for all products
      console.log('🔍 Product vote calculation:', {
        productId: product.id,
        productName: product.name,
        votes: product.votes,
        upvotes,
        downvotes,
        totalVoteCount,
        points
      })
      
      return {
        ...product,
        points,
        totalVoteCount, // Add this for the right side vote count
        tags: product.tags.split(',').map(tag => tag.trim()),
        userVote: userVotes[product.id] || null
      }
    })

    // Sort products by points
    const sortedProducts = productsWithPoints.sort((a, b) => b.points - a.points)

    // Featured products logic
    const getFeaturedProducts = () => {
      const featuredCriteria = {
        minUpvotes: 50,        // Minimum 50 upvotes
        minUpvoteRatio: 100,   // 100% upvote ratio (no downvotes)
        minComments: 10,       // Minimum 10 comments
        minDaysSinceLaunch: 7  // At least 7 days since launch
      }

      return sortedProducts.filter(product => {
        const upvotes = product.votes.filter(vote => vote.value === 1).length
        const downvotes = product.votes.filter(vote => vote.value === -1).length
        const totalVotes = upvotes + downvotes
        const upvoteRatio = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0
        const comments = product._count.comments || 0
        const daysSinceLaunch = Math.ceil((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))

        return (
          upvotes >= featuredCriteria.minUpvotes &&
          upvoteRatio >= featuredCriteria.minUpvoteRatio &&
          comments >= featuredCriteria.minComments &&
          daysSinceLaunch >= featuredCriteria.minDaysSinceLaunch
        )
      })
    }

    // If requesting featured products only, return them
    if (featuredOnly) {
      const featuredProducts = getFeaturedProducts()
      return NextResponse.json({
        products: featuredProducts.map(product => ({
          ...product,
          tags: product.tags.split(',').map(tag => tag.trim()),
          userVote: userVotes[product.id] || null
        }))
      })
    }

    // Separate products into different categories (ensure no duplicates)
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    console.log('📅 Date filtering:', {
      now: now.toISOString(),
      oneDayAgo: oneDayAgo.toISOString(),
      oneWeekAgo: oneWeekAgo.toISOString(),
      oneMonthAgo: oneMonthAgo.toISOString(),
      totalProducts: sortedProducts.length
    })

    // Show all products in each section (allow duplicates)
    const todaysProducts = sortedProducts.slice(0, 3)

    console.log('📊 Product distribution:', {
      todaysProducts: todaysProducts.length,
      todaysProductNames: todaysProducts.map(p => p.name)
    })

    const yesterdaysProducts = sortedProducts.slice(3, 6)

    const weeklyProducts = sortedProducts.slice(6, 9)

    const monthlyProducts = sortedProducts.slice(9, 12)

    // Get promoted products (separate from time-based sections)
    const promotedProducts = sortedProducts
      .filter(p => p.isPromoted)
      .slice(0, 3)

    const result = {
      todaysTop: todaysProducts.filter(p => !p.isPromoted).slice(0, 3),
      todaysPromoted: promotedProducts.slice(0, 1), // Only show 1 promoted in today's
      yesterdaysTop: yesterdaysProducts.filter(p => !p.isPromoted).slice(0, 3),
      yesterdaysPromoted: promotedProducts.slice(1, 2), // Show different promoted
      weeklyTop: weeklyProducts.filter(p => !p.isPromoted).slice(0, 3),
      weeklyPromoted: promotedProducts.slice(2, 3), // Show different promoted
      monthlyTop: monthlyProducts.filter(p => !p.isPromoted).slice(0, 3),
      monthlyPromoted: [], // No promoted in monthly to avoid duplicates
      featuredProducts: getFeaturedProducts(),
      userVotes
    }

    console.log('📊 API Response sections:', {
      todaysTop: result.todaysTop.length,
      yesterdaysTop: result.yesterdaysTop.length,
      weeklyTop: result.weeklyTop.length,
      monthlyTop: result.monthlyTop.length,
      todaysProductNames: result.todaysTop.map(p => p.name),
      yesterdaysProductNames: result.yesterdaysTop.map(p => p.name),
      weeklyProductNames: result.weeklyTop.map(p => p.name),
      monthlyProductNames: result.monthlyTop.map(p => p.name)
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
