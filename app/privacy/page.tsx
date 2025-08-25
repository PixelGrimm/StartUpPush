export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-foreground mb-12 text-center">Privacy Policy</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <div className="space-y-4 text-foreground">
                <p>
                  StartUpPush ("we," "our," or "us") operates the website startuppush.pro (the "Service"). 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website and use our services.
                </p>
                <p>
                  StartUpPush is a community-powered product discovery platform where users can discover, 
                  share, and promote innovative products. Users can boost their products by sharing them 
                  and generating traffic, which increases their product's ranking and visibility on the platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Personal Information</h3>
                  <p className="text-foreground mb-3">When you create an account or use our services, we may collect:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li><strong>Email address:</strong> Required for account creation and authentication</li>
                    <li><strong>Name:</strong> Optional, may be provided through OAuth providers</li>
                    <li><strong>Profile image:</strong> Optional, may be provided through OAuth providers</li>
                    <li><strong>Username:</strong> Automatically generated based on your email address</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Product Information</h3>
                  <p className="text-foreground mb-3">When you submit products to our platform, we collect:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Product name, description, and tagline</li>
                    <li>Website URL and social media links</li>
                    <li>Product screenshots and logos</li>
                    <li>Category classifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Usage and Analytics Data</h3>
                  <p className="text-foreground mb-3">We automatically collect certain information when you use our Service:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li><strong>IP addresses:</strong> Collected to track unique clicks on shared product links</li>
                    <li><strong>Click tracking data:</strong> When users click on shared product links</li>
                    <li><strong>Product interaction data:</strong> Upvotes, shares, and product views</li>
                    <li><strong>Search queries:</strong> To improve our search functionality</li>
                    <li><strong>Device and browser information:</strong> For website optimization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.4 OAuth Provider Information</h3>
                  <p className="text-foreground mb-3">When you sign in with Google, we receive:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Your Google account ID (used for account linking)</li>
                    <li>Email address</li>
                    <li>Name and profile picture (if available)</li>
                    <li>OAuth tokens for authentication purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Service Provision</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Creating and maintaining user accounts</li>
                    <li>Authenticating users through magic links and OAuth</li>
                    <li>Displaying submitted products and user profiles</li>
                    <li>Processing product submissions and publications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.2 StartUpPush Boost System</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Tracking unique clicks on shared product links using IP addresses</li>
                    <li>Calculating and applying StartUpPush Boost to products for successful referrals</li>
                    <li>Preventing fraud and duplicate boosts from the same IP address</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.3 Platform Improvement</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Analyzing usage patterns to improve our services</li>
                    <li>Enhancing search functionality based on user queries</li>
                    <li>Optimizing website performance and user experience</li>
                    <li>Developing new features based on user behavior</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.4 Communication</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Sending authentication emails (magic links)</li>
                    <li>Providing important service updates</li>
                    <li>Responding to user inquiries and support requests</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Public Information</h3>
                  <p className="text-foreground mb-3">The following information is publicly visible on our platform:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Published product information (name, description, website, screenshots)</li>
                    <li>User-generated content (product submissions, upvotes)</li>
                    <li>Public profile information (username, profile picture if provided)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Third-Party Services</h3>
                  <p className="text-foreground mb-3">We work with trusted third-party providers:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li><strong>Google OAuth:</strong> For authentication services</li>
                    <li><strong>Email service providers:</strong> For sending authentication and notification emails</li>
                    <li><strong>Cloud storage providers:</strong> For hosting uploaded images and files</li>
                    <li><strong>Hosting and infrastructure providers:</strong> For service availability</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Legal Requirements</h3>
                  <p className="text-foreground mb-3">We may disclose information when required by law or to:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Comply with legal processes or government requests</li>
                    <li>Protect our rights, property, or safety</li>
                    <li>Investigate and prevent fraud or abuse</li>
                    <li>Enforce our Terms of Service</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-foreground mb-3">We implement appropriate security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4 mb-4">
                <li>Secure data transmission using HTTPS encryption</li>
                <li>Password-free authentication through magic links and OAuth</li>
                <li>Regular security updates and monitoring</li>
                <li>Secure cloud storage for uploaded files</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
              <p className="text-foreground">
                While we strive to protect your information, no method of transmission over the internet 
                is 100% secure. We cannot guarantee absolute security but continuously work to improve 
                our security measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4 mb-4">
                <li><strong>Account data:</strong> Retained while your account is active</li>
                <li><strong>Product submissions:</strong> Retained indefinitely once published</li>
                <li><strong>Click tracking data:</strong> Retained for boost calculation and fraud prevention</li>
                <li><strong>Email communications:</strong> Retained for service provision</li>
                <li><strong>Analytics data:</strong> Retained in aggregated, non-identifiable form</li>
              </ul>
              <p className="text-foreground">
                You may request account deletion, after which we will remove your personal information 
                while maintaining published content in an anonymized form.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights and Choices</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Access and Control</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>View and update your account information in your settings</li>
                    <li>Control the visibility of your submitted products</li>
                    <li>Request a copy of your personal data</li>
                    <li>Delete your account and associated data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">7.2 Email Communications</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Essential emails (authentication, security) cannot be opted out</li>
                    <li>Marketing communications can be unsubscribed from</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies and Tracking</h2>
              <p className="text-foreground mb-3">
                We use essential cookies and similar technologies for authentication and service functionality. 
                We do not use third-party advertising cookies or tracking pixels. Our tracking is limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Session management for logged-in users</li>
                <li>Authentication state maintenance</li>
                <li>Basic analytics for service improvement</li>
                <li>IP-based click tracking for our boost system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. International Data Transfers</h2>
              <p className="text-foreground">
                Your information may be transferred to and processed in countries other than your country 
                of residence. We ensure appropriate safeguards are in place for such transfers in compliance 
                with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Children's Privacy</h2>
              <p className="text-foreground">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you become aware that a child has provided 
                us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of the Service after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
              <p className="text-foreground mb-3">If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
                             <div className="bg-muted p-4 rounded-lg">
                 <p className="text-foreground">
                   <strong>Email:</strong> info@startuppush.pro<br />
                   <strong>Website:</strong> https://startuppush.pro
                 </p>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
