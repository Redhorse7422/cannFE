'use client'

import React from 'react'

export default function ShippingPolicyPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Content */}
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-lg border border-gray-200 bg-white p-12 shadow-sm'>
          <section className='mx-auto mb-10 max-w-4xl px-4 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-primary'>Shipping Policy</h1>
            <div className='mx-auto h-1 w-24 rounded-full bg-secondary/60'></div>
          </section>
          <section className='mx-auto mb-20 max-w-4xl px-4'>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              We are committed to ensuring your satisfaction with any items/product you have ordered from us. If you are
              not satisfied with any items/product, we will accept returns as follows: After placing your order you will
              receive an order confirmation via email. Each order starts production 24 hours after your order is placed.
              Within 72 hours of you placing your order, you will receive an expected delivery date. When the order
              ships, you will receive another email with the tracking number and a link to trace the order online with
              the carrier.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              Under this rule, cancellation of your order shall not be considered once you have received confirmation of
              the same. If you proceed to cancel your order after it has been confirmed, We shall have a right to charge
              you cancellation fee of a minimum of 20% upto the order value, with a right to either not to refund the
              order value.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              We shall also have right to charge you cancellation fee for the orders cancelled by Cann-B for the reasons
              specified in the refunds policy.However, in the unlikely event that any product you have ordered from us
              is not received in good condition, is damaged or defective, or your order being unavailable, or if product
              delivered is different from what you had ordered, we will contact you on the phone number provided to us
              at the time of placing the order and inform you of such unavailability. In such an event you will be
              entitled to cancel the entire order and shall be entitled to a refund in accordance with our refund
              policy.
            </p>
            <p className='text-md mb-6 mt-4 leading-relaxed text-gray-700'>
              We reserve the sole right to cancel your order in the following circumstances:
              <br /> a. failure to contact you by phone or email at the time of confirming the order booking; <br />
              b. failure to deliver your order due to lack of information, direction or authorization from you at the
              time of delivery; or <br />
              c. unavailability of all the items ordered by you at the time of booking the order; or <br />
              d. unavailability of all the items ordered by you at the time of booking the order.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
