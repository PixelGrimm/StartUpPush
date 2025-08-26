import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
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

    const sales = await prisma.promotion.findMany({
      where: {
        ...dateFilter,
        type: { in: ['boosted', 'max-boosted'] }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to include amount
    const salesWithAmount = sales.map(sale => ({
      id: sale.id,
      type: sale.type,
      amount: sale.type === 'boosted' ? 50 : 100,
      createdAt: sale.createdAt,
      product: sale.product,
      user: sale.user
    }))

    return NextResponse.json({ sales: salesWithAmount })

  } catch (error) {
    console.error('Error fetching boost sales:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
