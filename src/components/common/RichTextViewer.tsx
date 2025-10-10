'use client'

import React from 'react'

import sanitizeHtml from '@/utils/sanitize-html'

type RichTextViewerProps = {
  html?: string
  className?: string
}

const RichTextViewer: React.FC<RichTextViewerProps> = ({ html, className }) => {
  const safeHtml = React.useMemo(() => sanitizeHtml(html || ''), [html])
  return (
    <div
      className={className || 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none'}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}

export default RichTextViewer


