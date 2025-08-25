import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get current month in YYYY-MM format (UK time)
const getCurrentMonth = () => {
  const now = new Date()
  // Convert to UK time (UTC+0 in winter, UTC+1 in summer)
  const ukTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}))
  return `${ukTime.getFullYear()}-${String(ukTime.getMonth() + 1).padStart(2, '0')}`
}

// Initialize monthly sales records if they don't exist
const initializeMonthlySales = async (month: string) => {
  const plans = [
    { planType: 'boosted', maxSpots: 50 },
    { planType: 'max-boosted', maxSpots: 25 },
    { planType: 'points', maxSpots: 100 }
  ]

  for (const plan of plans) {
    await prisma.boostSales.upsert({
      where: {
        month_planType: {
          month,
          planType: plan.planType
        }
      },
      update: {},
      create: {
        month,
        planType: plan.planType,
        soldCount: 0,
        maxSpots: plan.maxSpots,
        isActive: true
      }
    })
  }
}

export async function GET() {
  try {
    const currentMonth = getCurrentMonth()
    
    // Initialize sales records for current month
    await initializeMonthlySales(currentMonth)

    // Get current sales data
    const salesData = await prisma.boostSales.findMany({
      where: {
        month: currentMonth,
        isActive: true
      }
    })

    // Calculate remaining spots and discount status
    const boostPlans = salesData.map(sale => {
      const remainingSpots = Math.max(0, sale.maxSpots - sale.soldCount)
      const isSoldOut = remainingSpots === 0
      const hasDiscount = !isSoldOut // Discount is active if not sold out

      return {
        planType: sale.planType,
        soldCount: sale.soldCount,
        maxSpots: sale.maxSpots,
        remainingSpots,
        isSoldOut,
        hasDiscount,
        month: sale.month
      }
    })

    return NextResponse.json({
      currentMonth,
      plans: boostPlans
    })

  } catch (error) {
    console.error('Error fetching boost sales:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json()
    const currentMonth = getCurrentMonth()

    if (!planType || !['boosted', 'max-boosted', 'points'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Initialize sales records for current month
    await initializeMonthlySales(currentMonth)

    // Get current sales record
    const salesRecord = await prisma.boostSales.findUnique({
      where: {
        month_planType: {
          month: currentMonth,
          planType
        }
      }
    })

    if (!salesRecord) {
      return NextResponse.json(
        { error: 'Sales record not found' },
        { status: 404 }
      )
    }

    // Check if sold out
    if (salesRecord.soldCount >= salesRecord.maxSpots) {
      return NextResponse.json(
        { error: 'This plan is sold out for this month' },
        { status: 400 }
      )
    }

    // Increment sold count
    const updatedRecord = await prisma.boostSales.update({
      where: {
        id: salesRecord.id
      },
      data: {
        soldCount: {
          increment: 1
        }
      }
    })

    const remainingSpots = Math.max(0, updatedRecord.maxSpots - updatedRecord.soldCount)
    const isSoldOut = remainingSpots === 0

    return NextResponse.json({
      success: true,
      planType,
      soldCount: updatedRecord.soldCount,
      remainingSpots,
      isSoldOut,
      month: currentMonth
    })

  } catch (error) {
    console.error('Error recording boost sale:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Reset monthly sales (called on 1st of each month)
export async function PUT() {
  try {
    const currentMonth = getCurrentMonth()
    
    // Reset all sales records for the current month
    await prisma.boostSales.updateMany({
      where: {
        month: currentMonth
      },
      data: {
        soldCount: 0,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `Sales reset for ${currentMonth}`,
      currentMonth
    })

  } catch (error) {
    console.error('Error resetting boost sales:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
