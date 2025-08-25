export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-4xl font-bold text-foreground mb-12 text-center">Terms of Service</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-foreground">
                <p>
                  By accessing and using StartUpPush ("the Service"), you accept and agree to be bound by 
                  the terms and provision of this agreement.
                </p>
                <p>
                  StartUpPush is a community-powered product discovery platform that allows users to discover, 
                  share, and promote innovative products. StartUpPush Boost allows users to increase the ranking 
                  of their products, helping more people to discover and share them with their followers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Platform Overview</h3>
                  <p className="text-foreground mb-3">StartUpPush provides:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>A platform for discovering and browsing innovative products and tools</li>
                    <li>Product submission and publishing capabilities</li>
                    <li>A StartUpPush Boost system for product promotion</li>
                    <li>Community features including upvoting and sharing</li>
                    <li>Search and categorization of products</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.2 StartUpPush Boost</h3>
                  <p className="text-foreground mb-3">Our StartUpPush Boost system works as follows:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Users can apply a StartUpPush Boost to their product to increase its ranking and visibility on the platform</li>
                    <li>Boosted products are more likely to be discovered and shared by other users</li>
                    <li>StartUpPush Boost helps your product reach a wider audience</li>
                    <li>The use and effect of Boosts are tracked and recorded</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Account Creation</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>You must provide a valid email address to create an account</li>
                    <li>You may sign up using email authentication (magic links) or Google OAuth</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Account Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must keep your account information updated</li>
                    <li>You must not share your account with others</li>
                    <li>You must not create multiple accounts to circumvent our systems</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Content and Product Submissions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Submission Guidelines</h3>
                  <p className="text-foreground mb-3">When submitting products, you must ensure:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>All information provided is accurate and truthful</li>
                    <li>You have the right to submit the product information</li>
                    <li>The product is functional and accessible via the provided website URL</li>
                    <li>Screenshots and logos are original or properly licensed</li>
                    <li>Content does not violate any third-party rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Content Standards</h3>
                  <p className="text-foreground mb-3">All submitted content must:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Be appropriate for a general audience</li>
                    <li>Not contain offensive, defamatory, or harmful material</li>
                    <li>Not promote illegal activities or services</li>
                    <li>Not include spam, malware, or malicious content</li>
                    <li>Comply with applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Content Ownership</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>You retain ownership of the content you submit</li>
                    <li>You grant StartUpPush a license to display and promote your content</li>
                    <li>Published content may remain on the platform even after account deletion</li>
                    <li>We may remove content that violates these terms</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Prohibited Activities</h2>
              <p className="text-foreground mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Use automated systems to manipulate clicks, votes, or StartUpPush Boosts</li>
                <li>Create fake accounts or use multiple accounts fraudulently</li>
                <li>Submit false, misleading, or deceptive product information</li>
                <li>Attempt to circumvent our boost system or fraud prevention measures</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Submit products that compete directly with StartUpPush</li>
                <li>Use the platform for any commercial purpose other than product promotion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Platform Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>StartUpPush and its logos are trademarks owned by us</li>
                    <li>The platform design, code, and functionality are our intellectual property</li>
                    <li>You may not copy, modify, or reverse engineer our platform</li>
                    <li>You may not use our trademarks without written permission</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">6.2 User Content Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>You retain ownership of content you submit</li>
                    <li>You must have proper rights to all submitted content</li>
                    <li>You are responsible for any copyright or trademark infringement</li>
                    <li>We will respond to valid DMCA takedown requests</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Privacy and Data</h2>
              <p className="text-foreground">
                Your privacy is important to us. Our collection and use of personal information is governed 
                by our Privacy Policy, which is incorporated into these Terms by reference. By using our 
                Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Platform Availability and Modifications</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">8.1 Service Availability</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>We strive to maintain high service availability but cannot guarantee 100% uptime</li>
                    <li>We may temporarily suspend service for maintenance or updates</li>
                    <li>We are not liable for any downtime or service interruptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">8.2 Platform Changes</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>We may modify or discontinue features at any time</li>
                    <li>We may change boost requirements or system mechanics</li>
                    <li>We will provide reasonable notice for significant changes</li>
                    <li>Continued use constitutes acceptance of changes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Paid Services and Refund Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">9.1 Paid Promotion Services</h3>
                  <p className="text-foreground mb-3">
                    StartUpPush offers paid promotion services that allow users to enhance the visibility and 
                    reach of their products on our platform. These services include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Enhanced product visibility and ranking</li>
                    <li>Increased exposure to our user community</li>
                    <li>Priority placement in relevant product categories</li>
                    <li>Additional promotional features and tools</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">9.2 No Refund Policy</h3>
                  <p className="text-foreground mb-3"><strong>All payments for paid promotion services are final and non-refundable.</strong></p>
                  <p className="text-foreground mb-3">By subscribing to any paid promotion service, you acknowledge and agree that:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>No refunds will be provided for any reason</li>
                    <li>Services are provided on a subscription basis with no money-back guarantee</li>
                    <li>Cancellation of services does not entitle you to a refund of fees already paid</li>
                    <li>This policy applies regardless of usage or satisfaction with results</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">9.3 Service Performance and Guarantees</h3>
                  <p className="text-foreground mb-3">
                    While we are committed to providing high-quality promotion services, we make no guarantees 
                    regarding specific outcomes or results. However:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>We will make our best effort to deliver increased traffic to your promoted product</li>
                    <li>We will use industry-standard practices to maximize exposure within our platform</li>
                    <li>We will provide the promotional features and placement as described in your selected plan</li>
                    <li>Results may vary based on factors including product quality, market demand, and competition</li>
                    <li>We do not guarantee specific traffic volumes, conversion rates, or business outcomes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">9.4 Billing and Subscription Terms</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Subscriptions are billed in advance for the selected period</li>
                    <li>You may cancel your subscription at any time, but no refunds will be provided</li>
                    <li>Cancelled subscriptions will continue until the end of the current billing period</li>
                    <li>Prices are subject to change with advance notice</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Disclaimers and Limitations</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">10.1 Service Disclaimer</h3>
                  <p className="text-foreground">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                    EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES 
                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">10.2 User Content Disclaimer</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>We do not endorse or guarantee any products submitted by users</li>
                    <li>Users are responsible for evaluating products before engagement</li>
                    <li>We are not liable for any issues with third-party products or services</li>
                    <li>Product information may be inaccurate or outdated</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">10.3 Limitation of Liability</h3>
                  <p className="text-foreground">
                    TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                    LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Termination</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">11.1 Account Termination</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>You may delete your account at any time through your settings</li>
                    <li>We may suspend or terminate accounts that violate these terms</li>
                    <li>We may terminate accounts for fraudulent or abusive behavior</li>
                    <li>Termination does not affect previously published content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">11.2 Effect of Termination</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>Your access to the platform will be immediately revoked</li>
                    <li>Unused boosts will be forfeited</li>
                    <li>Published content may remain on the platform</li>
                    <li>These terms will survive termination where applicable</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Indemnification</h2>
              <p className="text-foreground">
                You agree to indemnify, defend, and hold harmless StartUpPush, its officers, directors, 
                employees, and agents from and against any and all claims, damages, obligations, losses, 
                liabilities, costs, or debt, and expenses (including attorney's fees) arising from your 
                use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">13. Governing Law and Disputes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">13.1 Governing Law</h3>
                  <p className="text-foreground">
                    These Terms shall be governed by and construed in accordance with the laws of the 
                    jurisdiction where StartUpPush is operated, without regard to conflict of law principles.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">13.2 Dispute Resolution</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                    <li>We encourage resolving disputes through direct communication</li>
                    <li>Any legal disputes will be resolved through binding arbitration</li>
                    <li>Class action lawsuits are not permitted</li>
                    <li>You may opt out of arbitration by contacting us within 30 days</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">14. Changes to Terms</h2>
              <p className="text-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes by posting the updated Terms on our website and updating the effective date. 
                Your continued use of the Service after such changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">15. Severability</h2>
              <p className="text-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that provision 
                will be limited or eliminated to the minimum extent necessary so that the remaining Terms 
                will otherwise remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">16. Contact Information</h2>
              <p className="text-foreground mb-3">If you have any questions about these Terms of Service, please contact us at:</p>
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
