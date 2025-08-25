"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FolderOpen, ArrowRight, ExternalLink, TrendingUp } from 'lucide-react'

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

const categories = [
  {
    name: 'AI Tools',
    description: 'Explore AI tools products',
    slug: 'ai-tools',
    productCount: productsByCategory['ai-tools']?.length || 0
  },
  {
    name: 'Analytics & Monitoring',
    description: 'Explore analytics & monitoring products',
    slug: 'analytics-monitoring',
    productCount: 0
  },
  {
    name: 'Automation & Workflow',
    description: 'Explore automation & workflow products',
    slug: 'automation-workflow',
    productCount: 0
  },
  {
    name: 'Customer Support',
    description: 'Explore customer support products',
    slug: 'customer-support',
    productCount: 0
  },
  {
    name: 'Cybersecurity & Privacy',
    description: 'Explore cybersecurity & privacy products',
    slug: 'cybersecurity-privacy',
    productCount: 0
  },
  {
    name: 'Design Tools',
    description: 'Explore design tools products',
    slug: 'design-tools',
    productCount: productsByCategory['design-tools']?.length || 0
  },
  {
    name: 'Developer Tools',
    description: 'Explore developer tools products',
    slug: 'developer-tools',
    productCount: productsByCategory['developer-tools']?.length || 0
  },
  {
    name: 'Education & Learning',
    description: 'Explore education & learning products',
    slug: 'education-learning',
    productCount: 0
  },
  {
    name: 'Fintech',
    description: 'Explore fintech products',
    slug: 'fintech',
    productCount: 0
  },
  {
    name: 'Free & Open Source',
    description: 'Explore free & open source products',
    slug: 'free-open-source',
    productCount: 0
  },
  {
    name: 'Health & Wellness',
    description: 'Explore health & wellness products',
    slug: 'health-wellness',
    productCount: 0
  },
  {
    name: 'Image Generation',
    description: 'Explore image generation products',
    slug: 'image-generation',
    productCount: 0
  },
  {
    name: 'No-Code / Low-Code',
    description: 'Explore no-code / low-code products',
    slug: 'nocode-lowcode',
    productCount: 0
  },
  {
    name: 'Other',
    description: 'Explore other products',
    slug: 'other',
    productCount: 0
  },
  {
    name: 'Project Management',
    description: 'Explore project management products',
    slug: 'project-management',
    productCount: 0
  },
  {
    name: 'Remote Collaboration',
    description: 'Explore remote collaboration products',
    slug: 'remote-collaboration',
    productCount: 0
  },
  {
    name: 'SEO & Content Marketing',
    description: 'Explore SEO & content marketing products',
    slug: 'seo-content-marketing',
    productCount: 0
  },
  {
    name: 'Social Media & Influencer Tools',
    description: 'Explore social media & influencer tools products',
    slug: 'social-media-influencer-tools',
    productCount: 0
  },
  {
    name: 'Web3 / Blockchain',
    description: 'Explore Web3 / blockchain products',
    slug: 'web3-blockchain',
    productCount: 0
  },
  {
    name: 'Website & Landing Page Builders',
    description: 'Explore website & landing page builders products',
    slug: 'website-landing-page-builders',
    productCount: 0
  },
  {
    name: 'Writing & Documentation',
    description: 'Explore writing & documentation products',
    slug: 'writing-documentation',
    productCount: 0
  }
]

export default function Categories() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FolderOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Browse Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover innovative products organized by category. From <strong>AI tools</strong> to <strong>design platforms</strong>, 
            find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/20 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {category.productCount} products
                </span>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                  Browse
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Want to add your product?
          </h2>
          <p className="text-muted-foreground mb-6">
            Submit your product and we'll help you find the right category.
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
