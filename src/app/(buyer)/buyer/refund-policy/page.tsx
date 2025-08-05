'use client'

import React from 'react'

export default function RefundPolicyPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Content */}
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-lg border border-gray-200 bg-white p-12 shadow-sm'>
          <section className='mx-auto mb-10 max-w-4xl px-4 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-primary'> Refund and Returns Policy </h1>
            <div className='mx-auto h-1 w-24 rounded-full bg-secondary/60'></div>
          </section>
          <section className='mx-auto mb-20 max-w-4xl px-4'>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              We have a 14-day return policy, which means you have 14 days after receiving your item to request a
              return.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              To be eligible for a return, your item must be in the same condition that you received it, unworn or
              unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and
              where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              You can always contact us for any return question at info@canngroupusa.com
              <br />
              <strong>Damages and issues</strong>
              <br />
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or
              if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              <strong>Exceptions / non-returnable items</strong>
              <br />
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants),
              custom products (such as special orders or personalized items), and personal care goods (such as beauty
              products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get
              in touch if you have questions or concerns about your specific item.
            </p>
            <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              <strong>Exchanges</strong>
              <br />
              The fastest way to ensure you get what you want is to return the item you have, and once the return is
              accepted, make a separate purchase for the new item.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              <strong>Refunds</strong>
              <br />
              We will notify you once we’ve received and inspected your return, and let you know if the refund was
              approved or not. If approved, you’ll be automatically refunded on your original payment method within 10
              business days. Please remember it can take some time for your bank or credit card company to process and
              post the refund too. If more than 15 business days have passed since we’ve approved your return, please
              contact us at info@canngroupusa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
