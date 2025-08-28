import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admin access
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    const userId = params.id

    let updateData: any = {}

    switch (action) {
      case 'ban':
        updateData = { isBanned: true }
        break
      case 'unban':
        updateData = { isBanned: false }
        break
      case 'mute':
        updateData = { isMuted: true }
        break
      case 'unmute':
        updateData = { isMuted: false }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `User ${action === 'ban' || action === 'mute' ? action + 'ned' : action === 'unban' ? 'unbanned' : 'unmuted'} successfully`
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
