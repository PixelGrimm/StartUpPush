"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, TrendingUp, Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useParams } from 'next/navigation'

// Dummy products data organized by category
const productsByCategory = {
  'ai-tools': [
    {
      id: 1,
      name: 'AI Writer Pro',
      tagline: 'AI-powered content creation tool',
      description: 'Generate high-quality content in seconds with advanced AI',
      websiteUrl: 'https://aiwriterpro.com',
      logoUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=64&h=64&fit=crop',
      voteCount: 156,
      points: 2840,
      mrr: '$12,500',
      isPromoted: true
    },
    {
      id: 2,
      name: 'ChatGPT Assistant',
      tagline: 'Enhanced ChatGPT interface',
      description: 'Better ChatGPT experience with advanced features',
      websiteUrl: 'https://chatgptassistant.com',
      logoUrl: 'https://images.unsplash.com/photo-1676299251956-4159187860d5?w=64&h=64&fit=crop',
      voteCount: 89,
      points: 1567,
      mrr: '$8,200',
      isPromoted: false
    },
    {
      id: 3,
      name: 'AI Image Generator',
      tagline: 'Create stunning images with AI',
      description: 'Generate beautiful images from text descriptions',
      websiteUrl: 'https://aiimagegen.com',
      logoUrl: 'https://images.unsplash.com/photo-1686191128892-3e87d4d6e8c1?w=64&h=64&fit=crop',
      voteCount: 234,
      points: 3420,
      mrr: '$15,800',
      isPromoted: true
    }
  ],
  'design-tools': [
    {
      id: 4,
      name: 'Design Studio',
      tagline: 'Professional design platform',
      description: 'Create stunning designs with our intuitive tools',
      websiteUrl: 'https://designstudio.com',
      logoUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=64&h=64&fit=crop',
      voteCount: 123,
      points: 1987,
      mrr: '$9,500',
      isPromoted: false
    },
    {
      id: 5,
      name: 'Color Palette Pro',
      tagline: 'Advanced color management',
      description: 'Generate and manage perfect color palettes',
      websiteUrl: 'https://colorpalettepro.com',
      logoUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=64&h=64&fit=crop',
      voteCount: 67,
      points: 1234,
      mrr: '$5,200',
      isPromoted: false
    }
  ],
  'developer-tools': [
    {
      id: 6,
      name: 'Code Editor Pro',
      tagline: 'Advanced code editor',
      description: 'Professional code editor with AI assistance',
      websiteUrl: 'https://codeeditorpro.com',
      logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=64&h=64&fit=crop',
      voteCount: 189,
      points: 2678,
      mrr: '$11,300',
      isPromoted: true
    }
  ]
}

const categoryNames = {
  'ai-tools': 'AI Tools',
  'design-tools': 'Design Tools',
  'developer-tools': 'Developer Tools',
  'analytics-monitoring': 'Analytics & Monitoring',
  'automation-workflow': 'Automation & Workflow',
  'customer-support': 'Customer Support',
  'cybersecurity-privacy': 'Cybersecurity & Privacy',
  'education-learning': 'Education & Learning',
  'fintech': 'Fintech',
  'free-open-source': 'Free & Open Source',
  'health-wellness': 'Health & Wellness',
  'image-generation': 'Image Generation',
  'nocode-lowcode': 'No-Code / Low-Code',
  'other': 'Other',
  'project-management': 'Project Management',
  'remote-collaboration': 'Remote Collaboration',
  'seo-content-marketing': 'SEO & Content Marketing',
  'social-media-influencer-tools': 'Social Media & Influencer Tools',
  'web3-blockchain': 'Web3 / Blockchain',
  'website-landing-page-builders': 'Website & Landing Page Builders',
  'writing-documentation': 'Writing & Documentation'
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const categoryName = categoryNames[slug as keyof typeof categoryNames] || slug
  const products = productsByCategory[slug as keyof typeof productsByCategory] || []

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            {products.length} products in this category
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={product.logoUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      {product.isPromoted && (
                        <span className="promoted-badge">Promoted</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{product.tagline}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">
                      🔥 {product.points}
                    </span>
                    <span className="text-muted-foreground">
                      👍 {product.voteCount}
                    </span>
                    {product.mrr && (
                      <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                        {product.mrr} MRR
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link href={`/p/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="flex-1">
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to submit a product to this category!
              </p>
              <Link href="/submit">
                <Button>
                  Submit Your Product
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Have a {categoryName} product?
          </h2>
          <p className="text-muted-foreground mb-6">
            Submit your product to this category and get discovered by the community.
          </p>
          <Link href="/submit">
            <Button size="lg" className="px-8">
              Submit Your Product
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
