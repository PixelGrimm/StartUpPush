import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await request.formData()
    
    // Extract form data
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const description = formData.get('description') as string
    const categories = formData.get('categories') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const mrr = formData.get('mrr') as string
    const logo = formData.get('logo') as File
    const screenshots = formData.getAll('screenshots') as File[]

    // Validation
    if (!name || !tagline || !description || !categories || !websiteUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (name.length > 40) {
      return NextResponse.json({ error: 'Product name too long' }, { status: 400 })
    }

    if (tagline.length > 60) {
      return NextResponse.json({ error: 'Tagline too long' }, { status: 400 })
    }

    if (description.length > 5000) {
      return NextResponse.json({ error: 'Description too long' }, { status: 400 })
    }

    // Parse categories
    const categoryArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat)
    if (categoryArray.length === 0 || categoryArray.length > 5) {
      return NextResponse.json({ error: 'Invalid number of categories' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(websiteUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 })
    }

    // Parse MRR (optional)
    let mrrValue = null
    if (mrr) {
      const parsed = parseFloat(mrr.replace(/[$,]/g, ''))
      if (!isNaN(parsed) && parsed >= 0) {
        mrrValue = parsed
      }
    }

    // Clean product name for URL (remove special characters, convert to lowercase, replace spaces with hyphens)
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // Check if a product with this name already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: name
      }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 })
    }

    // Process uploaded files
    let logoUrl = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop' // Default placeholder
    let screenshotUrls = ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'] // Default placeholder

    // Process logo if uploaded
    if (logo && logo.size > 0) {
      try {
        const logoBuffer = await logo.arrayBuffer()
        const logoBase64 = Buffer.from(logoBuffer).toString('base64')
        const logoMimeType = logo.type || 'image/png'
        logoUrl = `data:${logoMimeType};base64,${logoBase64}`
      } catch (error) {
        console.error('Error processing logo:', error)
        // Keep default placeholder if processing fails
      }
    }

    // Process screenshots if uploaded
    if (screenshots && screenshots.length > 0) {
      try {
        const processedScreenshots = []
        for (const screenshot of screenshots) {
          if (screenshot.size > 0) {
            const screenshotBuffer = await screenshot.arrayBuffer()
            const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64')
            const screenshotMimeType = screenshot.type || 'image/png'
            processedScreenshots.push(`data:${screenshotMimeType};base64,${screenshotBase64}`)
          }
        }
        if (processedScreenshots.length > 0) {
          screenshotUrls = processedScreenshots
        }
      } catch (error) {
        console.error('Error processing screenshots:', error)
        // Keep default placeholder if processing fails
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        tagline,
        description,
        website: websiteUrl,
        logo: logoUrl,
        screenshots: JSON.stringify(screenshotUrls), // Store screenshots as JSON string
        category: categoryArray[0], // Use first category as main category
        tags: categoryArray.join(', '), // Join categories as comma-separated string
        mrr: mrrValue,
        userId: session.user.id,
        isPromoted: false,
      },
    })

    // Add automatic upvote from the creator
    await prisma.vote.create({
      data: {
        value: 1, // Upvote
        userId: session.user.id,
        productId: product.id
      }
    })

    // Award 1 point to the product owner for the automatic upvote
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      product,
      message: 'Product submitted successfully with automatic upvote!' 
    })

  } catch (error) {
    console.error('Product submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
