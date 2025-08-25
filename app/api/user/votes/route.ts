import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const votes = await prisma.vote.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        productId: true,
        value: true,
      },
    })

    return NextResponse.json(votes)
  } catch (error) {
    console.error('Error fetching user votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user votes' },
      { status: 500 }
    )
  }
}
