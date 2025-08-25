import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { password } = await request.json()

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user with password and mark profile as complete
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        password: hashedPassword,
        isProfileComplete: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        isProfileComplete: true
      }
    })

    console.log('User updated successfully:', updatedUser)

    return NextResponse.json({
      message: 'Password set successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error setting password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
