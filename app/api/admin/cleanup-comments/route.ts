import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin access
    if (session?.user?.email !== 'alexszabo89@icloud.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete comments containing specific text
    const result1 = await prisma.comment.deleteMany({
      where: {
        OR: [
          { content: { contains: 'wtf' } },
          { content: { contains: 'hi' } },
          { content: { contains: 'test' } },
          { content: { contains: 'hello' } },
        ]
      }
    });

    // Also delete any comments that are very short (likely test comments)
    const result2 = await prisma.comment.deleteMany({
      where: {
        content: {
          in: ['wtf', 'wtf is this', 'hi', 'hello', 'test', 'a', 'b', 'c']
        }
      }
    });

    const totalDeleted = result1.count + result2.count;

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${totalDeleted} test comments`,
      deleted: totalDeleted
    });

  } catch (error) {
    console.error('Error cleaning up comments:', error);
    return NextResponse.json({ error: 'Failed to cleanup comments' }, { status: 500 });
  }
}
