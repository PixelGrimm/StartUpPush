"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface SimpleProductCardProps {
  product: {
    id: string
    name: string
    tagline: string
    category: string
    tags: string[] | string
    mrr?: number | null
    isPromoted: boolean
    points: number
    votes: Array<{ value: number }>
    _count: {
      votes: number
      comments: number
    }
  }
}

export function SimpleProductCard({ product }: SimpleProductCardProps) {
  const tagsArray = Array.isArray(product.tags) ? product.tags : [product.tags]
  
  // Calculate upvotes and downvotes
  const upvotes = product.votes.filter(vote => vote.value === 1).length
  const downvotes = product.votes.filter(vote => vote.value === -1).length
  
  // Create a proper slug for the product
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }
  
  const productSlug = createSlug(product.name)
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {/* Logo - Lightning bolt icon */}
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl text-yellow-400 font-bold">
            ⚡
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Link href={`/p/${productSlug}`} className="hover:underline">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tagsArray.slice(0, 1).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 dark:bg-gray-600 text-white text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Interaction Block */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {upvotes}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsDown className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {downvotes}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-purple-600 dark:text-purple-400">🔥 {product.points} StartUpPush</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{product._count.comments} comments</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">
                ⚡ Boost (50 pts)
              </Button>
              <Link href={`/p/${productSlug}`}>
                <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 text-xs px-3 py-1">
                  Visit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
