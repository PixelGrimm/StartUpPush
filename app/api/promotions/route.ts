import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, type, days } = await request.json()

    // Validate input
    if (!productId || !type || !days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if product exists and user owns it
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: session.user.id
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      )
    }

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        productId,
        type,
        startDate,
        endDate,
        isActive: true
      }
    })

    // Update product isPromoted status
    await prisma.product.update({
      where: { id: productId },
      data: { isPromoted: true }
    })

    return NextResponse.json({ success: true, promotion })
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
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
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Get active promotion for the product
    const promotion = await prisma.promotion.findFirst({
      where: {
        productId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!promotion) {
      return NextResponse.json({ promotion: null })
    }

    // Calculate days remaining
    const now = new Date()
    const endDate = new Date(promotion.endDate)
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      promotion: {
        ...promotion,
        daysRemaining: Math.max(0, daysRemaining)
      }
    })
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotion' },
      { status: 500 }
    )
  }
}
