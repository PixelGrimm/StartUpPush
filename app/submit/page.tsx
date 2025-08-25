"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Upload, Rocket } from 'lucide-react'

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

export default function SubmitProject() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
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
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('tagline', formData.tagline)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('categories', formData.categories.join(','))
      formDataToSend.append('websiteUrl', formData.websiteUrl)
      formDataToSend.append('mrr', formData.mrr)

      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }

      screenshotFiles.forEach(file => {
        formDataToSend.append('screenshots', file)
      })

      const response = await fetch('/api/products/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit product')
      }

      setSuccess(result.message || 'Product submitted successfully!')
      
      // Reset form
      setFormData({
        name: '',
        tagline: '',
        description: '',
        categories: [],
        websiteUrl: '',
        mrr: '',
      })
      setLogoFile(null)
      setScreenshotFiles([])

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Share Your Product with the World
            </h1>
            <p className="text-muted-foreground">
              Get discovered by thousands of potential users. Submit your project and join our growing community of innovators.
            </p>
          </div>

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
              <Label className="text-sm font-medium">Logo*</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground mb-2">
                  {logoFile ? logoFile.name : 'Upload a logo'}
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
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground mb-2">
                  {screenshotFiles.length > 0 
                    ? `${screenshotFiles.length} file(s) selected`
                    : 'Upload screenshots'
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mt-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Error:</span>
                  <span className="text-sm ml-2">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md mt-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Success:</span>
                  <span className="text-sm ml-2">{success}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
