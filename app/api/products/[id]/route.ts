import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            points: true,
            image: true
          }
        },
        votes: {
          select: {
            value: true,
            userId: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Calculate vote statistics
    const upvotes = product.votes.filter(vote => vote.value === 1).length
    const downvotes = product.votes.filter(vote => vote.value === -1).length
    const totalVotes = upvotes + downvotes
    const netVotes = upvotes - downvotes

    // Calculate points based on votes
    const points = (upvotes * 10) - (downvotes * 5)

    // Parse screenshots from JSON string
    let screenshots = []
    if (product.screenshots) {
      try {
        screenshots = JSON.parse(product.screenshots)
      } catch (error) {
        console.error('Error parsing screenshots:', error)
        screenshots = []
      }
    }

    return NextResponse.json({
      ...product,
      screenshots,
      upvotes,
      downvotes,
      totalVotes,
      netVotes,
      points
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Validate required fields
    if (!body.name || !body.tagline || !body.description || !body.categories || !body.websiteUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (body.name.length > 40) {
      return NextResponse.json({ error: 'Product name too long' }, { status: 400 })
    }

    if (body.tagline.length > 60) {
      return NextResponse.json({ error: 'Tagline too long' }, { status: 400 })
    }

    if (body.description.length > 5000) {
      return NextResponse.json({ error: 'Description too long' }, { status: 400 })
    }

    // Parse categories
    const categoryArray = body.categories.split(',').map((cat: string) => cat.trim()).filter((cat: string) => cat)
    if (categoryArray.length === 0 || categoryArray.length > 5) {
      return NextResponse.json({ error: 'Invalid number of categories' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(body.websiteUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 })
    }

    // Check if name is already taken by another product
    const nameConflict = await prisma.product.findFirst({
      where: {
        name: body.name,
        id: { not: id }
      }
    })

    if (nameConflict) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 })
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        website: body.websiteUrl,
        category: categoryArray[0],
        tags: categoryArray.join(', '),
        mrr: body.mrr,
        logo: body.logo || null,
        screenshots: body.screenshots ? JSON.stringify(body.screenshots) : null,
      }
    })

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully!'
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = params

    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the product (cascade will handle votes and comments)
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully!'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
