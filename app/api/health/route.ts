import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check - just return success
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'StartUpPush'
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
