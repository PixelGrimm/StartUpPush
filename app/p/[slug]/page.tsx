import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Share2, MessageCircle, Calendar, User, ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatNumber } from '@/lib/utils'
import { ProductDetailClient } from './product-detail-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const session = await getServerSession(authOptions)

  // Convert slug back to product name (handle special cases)
  let productName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Handle special cases for product names
  const slugToNameMap: Record<string, string> = {
    'notionai': 'NotionAI',
    'stripe': 'Stripe',
    'vercel': 'Vercel',
    'linear': 'Linear',
    'figma': 'Figma',
    'slack': 'Slack',
    'nimvue': 'Nimvue',
    'cicero': 'Cicero'
  }

  if (slugToNameMap[slug.toLowerCase()]) {
    productName = slugToNameMap[slug.toLowerCase()]
  }

  // Also try to find by exact slug match (for new products)
  let product = await prisma.product.findFirst({
    where: {
      name: {
        equals: productName
      },
      isActive: true
    },
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
        where: {
          parentId: null // Only get top-level comments
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true
                }
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      image: true
                    }
                  },
                  replies: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          name: true,
                          username: true,
                          image: true
                        }
                      },
                      replies: {
                        include: {
                          user: {
                            select: {
                              id: true,
                              name: true,
                              username: true,
                              image: true
                            }
                          },
                          replies: {
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
                              createdAt: 'asc'
                            }
                          }
                        },
                        orderBy: {
                          createdAt: 'asc'
                        }
                      }
                    },
                    orderBy: {
                      createdAt: 'asc'
                    }
                  }
                },
                orderBy: {
                  createdAt: 'asc'
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
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

  // If not found by name, try to find by slug pattern
  if (!product) {
    // Try to find products that match the slug pattern
    const allProducts = await prisma.product.findMany({
      where: {
        isActive: true
      },
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
          where: {
            parentId: null // Only get top-level comments
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                  }
                },
                replies: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                      }
                    },
                    replies: {
                      include: {
                        user: {
                          select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                          }
                        },
                        replies: {
                          include: {
                            user: {
                              select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true
                              }
                            },
                            replies: {
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
                                createdAt: 'asc'
                              }
                            }
                          },
                          orderBy: {
                            createdAt: 'asc'
                          }
                        }
                      },
                      orderBy: {
                        createdAt: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
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

    // Find product by matching slug
    product = allProducts.find(p => {
      const productSlug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return productSlug === slug.toLowerCase()
    })
  }



  if (!product) {
    notFound()
  }

  // Calculate vote statistics
  const upvotes = product.votes.filter(vote => vote.value === 1).length
  const downvotes = product.votes.filter(vote => vote.value === -1).length
  const totalVotes = upvotes + downvotes // Show total votes, not net votes
  const netVotes = upvotes - downvotes // Keep net votes for other calculations

  // Calculate points based on votes (same as client-side)
  const points = (upvotes * 10) - (downvotes * 5)

  // Get user's vote for this product
  let userVote = null
  if (session?.user?.id) {
    console.log('Session user ID:', session.user.id)
    console.log('Product votes:', product.votes)
    const userVoteRecord = product.votes.find(vote => vote.userId === session.user.id)
    userVote = userVoteRecord ? userVoteRecord.value : null
    console.log('User vote found:', userVote)
  }

  // Format tags
  const tags = product.tags.split(',').map(tag => tag.trim())

  // Parse screenshots from JSON string to array
  let screenshots = []
  if (product.screenshots) {
    try {
      screenshots = JSON.parse(product.screenshots)
    } catch (error) {
      console.error('Error parsing screenshots:', error)
      screenshots = []
    }
  }

  const productData = {
    ...product,
    points,
    tags,
    screenshots,
    totalVotes,
    upvotes,
    downvotes,
    userVote
  }

  return <ProductDetailClient product={productData} />
}
