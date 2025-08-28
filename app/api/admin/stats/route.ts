import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    const adminEmails = ['alexszabo89@icloud.com', 'admin@startuppush.com']
    if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
      console.log('Admin API - Unauthorized access attempt:', session?.user?.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    // Get total counts
    const [
      totalProjects,
      totalComments,
      totalUsers,
      totalBoosts,
      freeBoosts,
      paidBoosts,
      boostSales
    ] = await Promise.all([
      prisma.product.count({ where: dateFilter }),
      prisma.comment.count({ where: dateFilter }),
      prisma.user.count({ where: dateFilter }),
      prisma.promotion.count({ where: dateFilter }),
      prisma.promotion.count({ 
        where: { 
          ...dateFilter,
          type: 'free' 
        } 
      }),
      prisma.promotion.count({ 
        where: { 
          ...dateFilter,
          type: { in: ['boosted', 'max-boosted'] }
        } 
      }),
      prisma.promotion.findMany({
        where: {
          ...dateFilter,
          type: { in: ['boosted', 'max-boosted'] }
        },
        select: {
          type: true
        }
      })
    ])

    // Calculate total revenue with correct pricing
    const totalRevenue = boostSales.reduce((sum, sale) => {
      if (sale.type === 'boosted') return sum + 15  // Discounted price: $15 (70% off from $50)
      if (sale.type === 'max-boosted') return sum + 35  // Discounted price: $35 (80% off from $175)
      return sum
    }, 0)

    // Mock visitor data (in a real app, this would come from analytics)
    const dailyVisitors = Math.floor(Math.random() * 1000) + 500
    const weeklyVisitors = Math.floor(Math.random() * 5000) + 2000
    const monthlyVisitors = Math.floor(Math.random() * 20000) + 10000

    const stats = {
      totalProjects,
      totalComments,
      totalUsers,
      totalBoosts,
      freeBoosts,
      paidBoosts,
      totalRevenue,
      dailyVisitors,
      weeklyVisitors,
      monthlyVisitors
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
