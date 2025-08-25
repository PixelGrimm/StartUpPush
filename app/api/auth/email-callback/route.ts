import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const callbackUrl = searchParams.get('callbackUrl')

  if (!token || !email) {
    return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', request.url))
  }

  try {
    // This will be handled by NextAuth's built-in email provider
    // The token will be validated and the user will be signed in
    const redirectUrl = callbackUrl || '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('Email callback error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=CallbackError', request.url))
  }
}
