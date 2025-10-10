'use client'

import type { ProductTabsProps } from '@/types/product'

import React from 'react'

import sanitizeHtml from '@/utils/sanitize-html'

export const ProductTabs: React.FC<ProductTabsProps> = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    // { id: 'reviews', label: 'Reviews' },
  ]

  console.log(product.longDescription)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Description</h3>
              <div
                className='prose max-w-none text-gray-600'
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.longDescription || '') }}
              />
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {product.tags.map((tag, index) => (
                    <span key={index} className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'specifications':
        return (
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Product Information</h3>
              <div className='overflow-hidden rounded-lg bg-gray-50'>
                <table className='w-full'>
                  <tbody>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                        Product Name
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.name}</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>SKU</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.variations?.[0]?.sku || 'N/A'}</td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>Stock</td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.stock} units</td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                        Categories
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {product.categories?.map((cat) => cat.name).join(', ') || 'N/A'}
                      </td>
                    </tr>
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                        Shipping Type
                      </td>
                      <td className='px-6 py-4 text-sm capitalize text-gray-600'>{product.shippingType}</td>
                    </tr>
                    {product.shippingType !== 'free' && (
                      <tr className='bg-gray-50'>
                        <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                          Shipping Cost
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>${product.shippingCost}</td>
                      </tr>
                    )}
                    <tr className='bg-white'>
                      <td className='border-r border-gray-200 px-6 py-4 text-sm font-medium text-gray-900'>
                        Estimated Shipping Days
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{product.estShippingDays} days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {product.variations && product.variations.length > 0 && (
              <div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Available Variations</h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {product.variations.map((variation, index) => (
                    <div key={index} className='rounded-lg border border-gray-200 p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-medium text-gray-900'>{variation.attributeName}</p>
                          <p className='text-sm text-gray-600'>{variation.attributeValue}</p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium text-gray-900'>${variation.price}</p>
                          <p className='text-sm text-gray-600'>Stock: {variation.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      // case 'reviews':
      //   return (
      //     <div className='space-y-6'>
      //       <div className='flex items-center justify-between'>
      //         <div>
      //           <h3 className='text-lg font-semibold text-gray-900'>Customer Reviews</h3>
      //           <div className='mt-2 flex items-center'>
      //             <div className='flex items-center'>
      //               {[...Array(5)].map((_, i) => (
      //                 <StarIcon
      //                   key={i}
      //                   className={`h-5 w-5 ${i < Math.floor(Number(product.rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
      //                 />
      //               ))}
      //             </div>
      //             <span className='ml-2 text-sm text-gray-600'>{product.rating} out of 5</span>
      //           </div>
      //         </div>
      //         <button className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'>
      //           Write a Review
      //         </button>
      //       </div>

      //       <div className='py-8 text-center'>
      //         <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
      //       </div>
      //     </div>
      //   )

      default:
        return null
    }
  }

  return (
    <div className='rounded-lg bg-white shadow-sm'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8 px-6'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='p-6'>{renderTabContent()}</div>
    </div>
  )
}
