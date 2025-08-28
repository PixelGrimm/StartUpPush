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

    console.log('Admin comments API: Fetching all comments...')

    const comments = await prisma.comment.findMany({
      where: {
        // Show all comments regardless of status for admin
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Admin comments API: Found ${comments.length} comments`)
    console.log('Comments:', comments.map(c => ({ id: c.id, content: c.content.substring(0, 50), status: c.status })))

    return NextResponse.json({ comments })

  } catch (error) {
    console.error('Error fetching admin comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
