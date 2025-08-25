"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Upload, Users, TrendingUp, Mail, Share2, Target } from 'lucide-react'

export default function Advertise() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    productName: '',
    productTagline: '',
    websiteUrl: '',
    contactEmail: '',
    adDuration: '',
    budget: '',
    advertisingChannels: [] as string[],
    additionalInfo: '',
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      advertisingChannels: prev.advertisingChannels.includes(channel)
        ? prev.advertisingChannels.filter(c => c !== channel)
        : [...prev.advertisingChannels, channel]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess('Thank you for your interest! We will reach out within 24 hours to discuss your advertising campaign.')
      
      // Reset form
      setFormData({
        productName: '',
        productTagline: '',
        websiteUrl: '',
        contactEmail: '',
        adDuration: '',
        budget: '',
        advertisingChannels: [],
        additionalInfo: '',
      })
      setLogoFile(null)

    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Thank you for choosing to advertise with StartUpPush!
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect your product with thousands of startup founders, indie makers, and tech enthusiasts 
            who actively create and discover innovative products every day.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">What You'll Get</h2>
              <p className="text-muted-foreground mb-6">
                Showcase your product to engaged builders and entrepreneurs who actively discover, 
                share, and promote innovative solutions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Premium Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Direct Traffic to Your Product</h4>
                    <p className="text-sm text-muted-foreground">No redirects or barriers - users click and land straight on your site</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Top-Tier Homepage Visibility</h4>
                    <p className="text-sm text-muted-foreground">Featured prominently where builders first land and explore products</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Share2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Standout Product List Placement</h4>
                    <p className="text-sm text-muted-foreground">Badge highlighting and elevated positioning across all product listings</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Weekly Newsletter Feature</h4>
                    <p className="text-sm text-muted-foreground">Dedicated spotlight reaching thousands of subscribed builders and founders</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Share2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Social Media Amplification</h4>
                    <p className="text-sm text-muted-foreground">Strategic promotion across our X (Twitter) to expand your reach</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Who Will See It</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">20,000+</div>
                  <div className="text-sm text-muted-foreground">Monthly page views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,000+</div>
                  <div className="text-sm text-muted-foreground">Active builders</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Perfect audience for:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Developer tools & SaaS products</li>
                  <li>• Go-to-market and growth solutions</li>
                  <li>• Startup and entrepreneur resources</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Let's Get Your Campaign Started
            </h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we'll reach out within 24 hours to discuss your advertising 
              goals and create a custom campaign.
            </p>

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
                <Label htmlFor="productName" className="text-sm font-medium">
                  Product name *
                </Label>
                <Input
                  id="productName"
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              {/* Product Tagline */}
              <div>
                <Label htmlFor="productTagline" className="text-sm font-medium">
                  Product tagline *
                </Label>
                <Input
                  id="productTagline"
                  type="text"
                  value={formData.productTagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, productTagline: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium">Logo (squared) *</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                  <Label htmlFor="logo" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      Choose File
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Website URL */}
              <div>
                <Label htmlFor="websiteUrl" className="text-sm font-medium">
                  Website URL *
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              {/* Contact Email */}
              <div>
                <Label htmlFor="contactEmail" className="text-sm font-medium">
                  Contact email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  required
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  We will reach out to this email to discuss your campaign details
                </div>
              </div>

              {/* Ad Duration */}
              <div>
                <Label htmlFor="adDuration" className="text-sm font-medium">
                  How long do you want to run your ads? *
                </Label>
                <Input
                  id="adDuration"
                  type="text"
                  value={formData.adDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, adDuration: e.target.value }))}
                  placeholder="e.g., 1 month, 3 months"
                  required
                  className="mt-1"
                />
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget" className="text-sm font-medium">
                  What's your advertisement budget? *
                </Label>
                <Input
                  id="budget"
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., $500, $1000-2000"
                  required
                  className="mt-1"
                />
              </div>

              {/* Advertising Channels */}
              <div>
                <Label className="text-sm font-medium">
                  Where do you want to advertise on StartUpPush? *
                </Label>
                <div className="mt-2 space-y-2">
                  {['Website', 'Newsletter', 'Social Media'].map((channel) => (
                    <label key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.advertisingChannels.includes(channel)}
                        onChange={() => handleChannelToggle(channel)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium">
                  Anything else you want to mention?
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
