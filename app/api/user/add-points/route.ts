import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { points = 50 } = await request.json()

    // Update user points
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: points } },
      select: { points: true }
    })

    return NextResponse.json({
      success: true,
      message: `Added ${points} points to your account`,
      points: updatedUser.points
    })

  } catch (error) {
    console.error('Error adding points:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
