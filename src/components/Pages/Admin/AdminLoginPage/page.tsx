import Image from 'next/image'

import LOGO from '@/assets/logos/logo.png'
import Signin from '@/components/Auth/Signin'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

export default function AdminLogin() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-900'>
      <div className='w-full max-w-3xl'>
        <Breadcrumb pageName='Sign In' />

        <div className='rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
          <div className='flex flex-wrap items-center'>
            <div className='w-full'>
              <div className='w-full p-4 sm:p-12.5 xl:p-15'>
                <div className='mt-5'>
                  <Image src={LOGO} alt='Logo' width={200} height={180} className='mx-auto dark:opacity-30' />
                </div>
                <Signin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
