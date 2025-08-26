import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/notification-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // Fetch updates from the database
    const whereClause = projectId ? {
      productId: projectId,
    } : {
      product: {
        userId: session.user.id,
      },
    }
    
    const updates = await prisma.update.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ updates })
  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session in POST /api/updates:', session)
    console.log('Session user:', session?.user)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, projectId: requestProjectId } = body
    console.log('Request body:', { title, content, projectId: requestProjectId })

    if (!title || !content || !requestProjectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Looking for project with ID:', requestProjectId, 'and user ID:', session.user.id)
    
    // Verify the project exists and belongs to the user
    const project = await prisma.product.findFirst({
      where: {
        id: requestProjectId,
        userId: session.user.id,
        isActive: true
      }
    })

    console.log('Found project:', project)

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Create the update in the database
    const update = await prisma.update.create({
      data: {
        title,
        content,
        productId: requestProjectId,
        userId: session.user.id,
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

    // Create notification for project followers (for now, just notify the project owner)
    try {
      await NotificationService.createUpdateNotification(
        requestProjectId,
        update.id,
        session.user.id,
        project.userId
      )
    } catch (notificationError) {
      console.error('Error creating update notification:', notificationError)
      // Don't fail the update if notification fails
    }

    return NextResponse.json({ update })
  } catch (error) {
    console.error('Error creating update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
