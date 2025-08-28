import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admin access
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            products: true,
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Admin users API - Found users:', users.length)
    console.log('Admin users API - User details:', users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      isBanned: u.isBanned,
      isMuted: u.isMuted,
      points: u.points
    })))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
