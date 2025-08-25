import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { updateId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const update = await prisma.update.findFirst({
      where: {
        id: params.updateId,
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            name: true,
            logo: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 })
    }

    return NextResponse.json({ update })
  } catch (error) {
    console.error('Error fetching update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { updateId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the update exists and belongs to the user
    const existingUpdate = await prisma.update.findFirst({
      where: {
        id: params.updateId,
        userId: session.user.id,
      },
    })

    if (!existingUpdate) {
      return NextResponse.json({ error: 'Update not found or access denied' }, { status: 404 })
    }

    // Update the update in the database
    const update = await prisma.update.update({
      where: {
        id: params.updateId,
      },
      data: {
        title,
        content,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ update })
  } catch (error) {
    console.error('Error updating update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
