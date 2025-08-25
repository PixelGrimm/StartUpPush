"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  featuredProducts: Array<{
    id: string
    name: string
    tagline: string
    logo?: string | null
    website: string
    category: string
  }>
  latestPosts: Array<{
    id: string
    title: string
    slug: string
    excerpt?: string | null
    createdAt: Date
  }>
}

export function Sidebar({ featuredProducts, latestPosts }: SidebarProps) {
  return (
    <aside className="w-80 space-y-8">
      {/* Featured Products */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold whitespace-nowrap">🏆 Featured Products</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/featured">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="flex items-start space-x-3 group">
              <div className="flex-shrink-0">
                {product.logo ? (
                  <Image
                    src={product.logo}
                    alt={product.name}
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold text-sm">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <Link href={`/p/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                    {product.name}
                  </h4>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.tagline}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {product.category}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    asChild
                  >
                    <Link href={`/p/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest from Blog */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Latest from Blog</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {latestPosts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`}>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <time className="text-xs text-muted-foreground mt-2 block">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </aside>
  )
}
