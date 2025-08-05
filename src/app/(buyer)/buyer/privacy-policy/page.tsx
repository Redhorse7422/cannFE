'use client'

import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Content */}
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-lg border border-gray-200 bg-white p-12 shadow-sm'>
          <section className='mx-auto mb-20 max-w-4xl px-4 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-primary'>Privacy Policy</h1>
            <div className='mx-auto h-1 w-24 rounded-full bg-secondary/60'></div>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              This Privacy Policy describes how cann-cbd.com (the `&apos; Site` or ` &apos;we`) collects, uses, and
              discloses your Personal Information when you visit or make a purchase from the Site.
            </p>
          </section>

          {/* Contact Section */}
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Contact</h2>
            <p className='mb-4 leading-relaxed text-gray-700'>
              After reviewing this policy, if you have additional questions, want more information about our privacy
              practices, or would like to make a complaint, please contact us by e-mail at{' '}
              <a href='mailto:info@canngroupusa.com' className='text-primary hover:underline'>
                info@canngroupusa.com
              </a>{' '}
              or by mail using the details provided below:
            </p>
            <div className='rounded-lg bg-gray-50 p-4'>
              <div className='space-y-1 text-gray-700'>
                <p>13530 Michigan Avenue,</p>
                <p>Dearborn MI 48126</p>
                <p>United States of America</p>
              </div>
            </div>
          </section>

          {/* Collecting Personal Information */}
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Collecting Personal Information</h2>
            <p className='mb-6 leading-relaxed text-gray-700'>
              When you visit the Site, we collect certain information about your device, your interaction with the Site,
              and information necessary to process your purchases. We may also collect additional information if you
              contact us for customer support. In this Privacy Policy, we refer to any information about an identifiable
              individual (including the information below) as Personal Information. See the list below for more
              information about what Personal Information we collect and why.
            </p>

            {/* Device Information */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold text-gray-800'>Device information</h3>
              <div className='space-y-2 text-gray-700'>
                <p>
                  <strong>Purpose of collection:</strong> to load the Site accurately for you, and to perform analytics
                  on Site usage to optimize our Site.
                </p>
                <p>
                  <strong>Source of collection:</strong> Collected automatically when you access our Site using cookies,
                  log files, web beacons, tags, or pixels
                </p>
                <p>
                  <strong>Disclosure for a business purpose:</strong> shared with our processor shopify
                </p>
                <p>
                  <strong>Personal Information collected:</strong> version of web browser, IP address, time zone, cookie
                  information, what sites or products you view, search terms, and how you interact with the Site
                </p>
              </div>
            </div>

            {/* Order Information */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold text-gray-800'>Order information</h3>
              <div className='space-y-2 text-gray-700'>
                <p>
                  <strong>Purpose of collection:</strong> to provide products or services to you to fulfill our
                  contract, to process your payment information, arrange for shipping, and provide you with invoices
                  and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and
                  when in line with the preferences you have shared with us, provide you with information or advertising
                  relating to our products or services.
                </p>
                <p>
                  <strong>Source of collection:</strong> collected from you.
                </p>
                <p>
                  <strong>Disclosure for a business purpose:</strong> shared with our processor Shopify
                </p>
                <p>
                  <strong>Personal Information collected:</strong> name, billing address, shipping address, payment
                  information (including credit card, email address, and phone number.
                </p>
              </div>
            </div>

            {/* Customer Support Information */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold text-gray-800'>Customer support information</h3>
              <div className='space-y-2 text-gray-700'>
                <p>
                  <strong>Purpose of collection:</strong> to provide customer support.
                </p>
                <p>
                  <strong>Source of collection:</strong> collected from you
                </p>
                <p>
                  <strong>Disclosure for a business purpose:</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Minors Section */}
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Minors</h2>
            <p className='leading-relaxed text-gray-700'>
              The Site is not intended for individuals under the age of [INSERT AGE]. We do not intentionally collect
              Personal Information from children. If you are the parent or guardian and believe your child has provided
              us with Personal Information, please contact us at the address above to request deletion.
            </p>
          </section>

          {/* Sharing Personal Information */}
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Sharing Personal Information</h2>
            <div className='space-y-4 text-gray-700'>
              <p>
                We share your Personal Information with service providers to help us provide our services and fulfill
                our contracts with you, as described above.
              </p>
              <p>
                We may share your Personal Information to comply with applicable laws and regulations, to respond to a
                subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our
                rights.
              </p>
            </div>
          </section>

          {/* Important Notice */}
          <section className='border-t border-gray-200 pt-8'>
            <div className='rounded-lg bg-blue-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-blue-900'>Important Notice</h3>
              <p className='leading-relaxed text-blue-800'>
                This Privacy Policy explains how we collect, use, and protect your personal information. Please read
                carefully to understand our practices regarding your privacy and data protection.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
