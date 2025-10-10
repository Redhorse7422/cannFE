'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '../common/icon'

type CarouselSlide = {
  id: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  imageSrc: string
}

type CarouselProps = {
  slides: CarouselSlide[]
  intervalMs?: number
}

export const Carousel: React.FC<CarouselProps> = ({ slides, intervalMs = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides])
  const goTo = (index: number) => {
    if (!safeSlides.length) return
    const next = (index + safeSlides.length) % safeSlides.length
    setCurrentIndex(next)
  }

  const next = () => goTo(currentIndex + 1)
  const prev = () => goTo(currentIndex - 1)

  useEffect(() => {
    if (!safeSlides.length) return
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % safeSlides.length)
    }, intervalMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [safeSlides.length, intervalMs])

  if (!safeSlides.length) return null

  return (
    <div className='relative mx-auto max-w-7xl px-4'>
      <div className='relative h-[420px] overflow-hidden rounded-2xl shadow-lg sm:h-[520px]'>
        {safeSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={i !== currentIndex}
          >
            <div className='relative h-full w-full'>
              <Image
                src={slide.imageSrc}
                alt={slide.title || 'carousel'}
                fill
                priority={i === 0}
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent' />
              <div className='absolute left-0 top-0 flex h-full w-full items-center px-16 py-10 sm:px-16'>
                <div className='max-w-xl text-white'>
                  {slide.subtitle && (
                    <p className='mb-2 text-sm font-semibold uppercase tracking-wider text-green-300'>
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.title && (
                    <h2 className='mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl'>
                      {slide.title}
                    </h2>
                  )}
                  {slide.ctaText && slide.ctaHref && (
                    <Link
                      href={slide.ctaHref}
                      className='inline-block rounded-lg bg-green-400 px-6 py-3 font-semibold text-blue-900 shadow-lg transition-colors hover:bg-green-500'
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type='button'
          aria-label='Previous slide'
          onClick={prev}
          className='absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60'
        >
          {/* <ChevronLeft className='h-6 w-6' /> */}
          <Icon name='AiOutlineArrowLeft' className='h-6 w-6' color='white' />
        </button>
        <button
          type='button'
          aria-label='Next slide'
          onClick={next}
          className='absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60'
        >
          <Icon name='AiOutlineArrowRight' className='h-6 w-6' color='white' />
        </button>
        <div className='pointer-events-none absolute bottom-4 left-0 flex w-full items-center justify-center gap-2'>
          {safeSlides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
