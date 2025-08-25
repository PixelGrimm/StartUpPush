import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, username, bio, website, twitter, github, linkedin } = body

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { error: 'Name and username are required' },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        email: { not: session.user.email } // Exclude current user
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        username,
        bio: bio || null,
        website: website || null,
        twitter: twitter || null,
        github: github || null,
        linkedin: linkedin || null,
        isProfileComplete: true,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        website: updatedUser.website,
        twitter: updatedUser.twitter,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        isProfileComplete: updatedUser.isProfileComplete
      }
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        website: true,
        twitter: true,
        github: true,
        linkedin: true,
        image: true,
        points: true,
        isProfileComplete: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
