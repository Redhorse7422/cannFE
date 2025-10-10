import Image from 'next/image'

import darkLogo from '@/assets/logos/logo.png'

export function Logo() {
  return (
    <div className='relative h-8 max-w-[10.847rem]'>
      <Image
        src={darkLogo}
        className='dark:hidden'
        alt='NextAdmin logo'
        role='presentation'
        quality={100}
        width={120}
      />

      <Image
        src={darkLogo}
        className='hidden dark:block'
        alt='NextAdmin logo'
        role='presentation'
        quality={100}
        width={100}
      />
    </div>
  )
}
