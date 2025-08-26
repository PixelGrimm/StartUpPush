import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { action } = await request.json()

    if (!['approve', 'jail', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (action === 'delete') {
      // Delete the project and all related data
      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { productId: id } }),
        prisma.vote.deleteMany({ where: { productId: id } }),
        prisma.promotion.deleteMany({ where: { productId: id } }),
        prisma.product.delete({ where: { id } })
      ])
    } else {
      // Update project status
      const status = action === 'approve' ? 'active' : 'jailed'
      await prisma.product.update({
        where: { id },
        data: { status }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
