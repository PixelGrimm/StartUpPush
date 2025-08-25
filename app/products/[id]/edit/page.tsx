"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Trash2, AlertTriangle, Upload } from 'lucide-react'

const categories = [
  'AI Tools',
  'Analytics & Monitoring',
  'Automation & Workflow',
  'Customer Support',
  'Cybersecurity & Privacy',
  'Design Tools',
  'Developer Tools',
  'Education & Learning',
  'Fintech',
  'Free & Open Source',
  'Health & Wellness',
  'Image Generation',
  'No-Code / Low-Code',
  'Other',
  'Project Management',
  'Remote Collaboration',
  'SEO & Content Marketing',
  'Social Media & Influencer Tools',
  'Web3 / Blockchain',
  'Website & Landing Page Builders',
  'Writing & Documentation',
]

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  website: string
  category: string
  tags: string
  mrr: number | null
  userId: string
}

export default function EditProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    categories: [] as string[],
    websiteUrl: '',
    mrr: '',
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([])
  const [currentLogo, setCurrentLogo] = useState<string>('')
  const [currentScreenshots, setCurrentScreenshots] = useState<string[]>([])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProduct()
  }, [session, status, router, productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        
        // Parse categories from tags string
        const categoryArray = data.tags.split(',').map((cat: string) => cat.trim())
        
        setFormData({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          categories: categoryArray,
          websiteUrl: data.website,
          mrr: data.mrr ? data.mrr.toString() : '',
        })
        
        // Set current images
        setCurrentLogo(data.logo || '')
        setCurrentScreenshots(data.screenshots || [])
      } else {
        setError('Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : prev.categories.length < 5
        ? [...prev.categories, category]
        : prev.categories
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file size must be less than 2MB')
        return
      }
      setLogoFile(file)
      setError('')
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 10) {
      setError('Maximum 10 screenshots allowed')
      return
    }
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot file size must be less than 5MB')
        return
      }
    }
    
    setScreenshotFiles(files)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Process uploaded files
      let logoUrl = currentLogo // Keep current logo if no new file
      let screenshotUrls = currentScreenshots // Keep current screenshots if no new files

      // Process new logo if uploaded
      if (logoFile && logoFile.size > 0) {
        try {
          const logoBuffer = await logoFile.arrayBuffer()
          const logoBase64 = Buffer.from(logoBuffer).toString('base64')
          const logoMimeType = logoFile.type || 'image/png'
          logoUrl = `data:${logoMimeType};base64,${logoBase64}`
        } catch (error) {
          console.error('Error processing logo:', error)
          // Keep current logo if processing fails
        }
      }

      // Process new screenshots if uploaded
      if (screenshotFiles && screenshotFiles.length > 0) {
        try {
          const processedScreenshots = []
          for (const screenshot of screenshotFiles) {
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
          // Keep current screenshots if processing fails
        }
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          tagline: formData.tagline,
          description: formData.description,
          categories: formData.categories.join(','),
          websiteUrl: formData.websiteUrl,
          mrr: formData.mrr ? parseFloat(formData.mrr.replace(/[$,]/g, '')) : null,
          logo: logoUrl,
          screenshots: screenshotUrls,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product')
      }

      setSuccess('Product updated successfully!')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteModal(false)
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete product')
      }

      setSuccess('Product deleted successfully!')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Edit Product
              </h1>
              <p className="text-muted-foreground">
                Update your product information
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Product name*
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={40}
                required
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.name.length}/40
              </div>
            </div>

            {/* Tagline */}
            <div>
              <Label htmlFor="tagline" className="text-sm font-medium">
                One-line tagline*
              </Label>
              <Input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                maxLength={60}
                required
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.tagline.length}/60
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Product description*
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                maxLength={5000}
                rows={6}
                required
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/5000
              </div>
            </div>

            {/* Categories */}
            <div>
              <Label className="text-sm font-medium">
                Categories* ({formData.categories.length}/5)
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.categories.includes(category)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Website URL */}
            <div>
              <Label htmlFor="websiteUrl" className="text-sm font-medium">
                Website URL*
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="https://example.com"
                required
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Enter the full URL including https://. This will be the main link users click to visit your product.
              </div>
            </div>

            {/* MRR */}
            <div>
              <Label htmlFor="mrr" className="text-sm font-medium">
                MRR - Monthly Recurring Revenue (Optional)
              </Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <Input
                  id="mrr"
                  type="text"
                  value={formData.mrr}
                  onChange={(e) => setFormData(prev => ({ ...prev, mrr: e.target.value }))}
                  placeholder="1000"
                  className="pl-8"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Enter your current monthly recurring revenue in USD. This information is optional and will be displayed as a badge next to your product.
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium">Logo</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {currentLogo && (
                  <div className="mb-4">
                    <img 
                      src={currentLogo} 
                      alt="Current logo" 
                      className="w-16 h-16 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Current logo</p>
                  </div>
                )}
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground mb-2">
                  {logoFile ? logoFile.name : 'Upload a new logo (optional)'}
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  PNG, JPG up to 2MB. Logos should be squared, up to 1024x1024 pixels.
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('logo')?.click()}
                  className="cursor-pointer"
                >
                  Choose File
                </Button>
              </div>
            </div>

            {/* Screenshots Upload */}
            <div>
              <Label className="text-sm font-medium">Screenshots</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {currentScreenshots.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentScreenshots.map((screenshot, index) => (
                        <img 
                          key={index}
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`} 
                          className="w-20 h-16 rounded object-cover"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Current screenshots</p>
                  </div>
                )}
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground mb-2">
                  {screenshotFiles.length > 0 
                    ? `${screenshotFiles.length} new file(s) selected`
                    : 'Upload new screenshots (optional)'
                  }
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  Up to 10 images (PNG, JPG up to 5MB each)
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotChange}
                  className="hidden"
                  id="screenshots"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('screenshots')?.click()}
                  className="cursor-pointer"
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                disabled={saving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
              
              <Button
                type="submit"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Product
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{product?.name}</strong>? This will permanently remove the product and all associated data.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
