'use client'

import type { McdArticleDocument, McdLcdDocument, McdContractor, McdResponseToComment } from '@/types/mcd'

import React, { useState } from 'react'

import { FiChevronDown, FiChevronUp, FiCalendar, FiFileText, FiUsers, FiMessageCircle } from 'react-icons/fi'

interface AccordionSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-dark-3/50'
      >
        <div className='flex items-center gap-3'>
          {icon && <div className='text-primary'>{icon}</div>}
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>{title}</h2>
        </div>
        <div className='text-gray-500 dark:text-gray-400'>
          {isOpen ? <FiChevronUp className='h-5 w-5' /> : <FiChevronDown className='h-5 w-5' />}
        </div>
      </button>
      {isOpen && <div className='border-t border-gray-200 px-6 py-4 dark:border-dark-3'>{children}</div>}
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string | null | undefined
  renderAsHtml?: boolean
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, renderAsHtml = false }) => {
  if (!value) return null

  // Check if value contains HTML tags
  const containsHtml = /<[a-z][\s\S]*>/i.test(value)
  const shouldRenderHtml = renderAsHtml || containsHtml

  return (
    <div className='border-b border-gray-100 py-3 last:border-0 dark:border-dark-3'>
      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>{label}</dt>
      {shouldRenderHtml ? (
        <dd
          className='prose prose-sm dark:prose-invert mt-2 max-w-none text-gray-900 dark:text-gray-100'
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100'>{value}</dd>
      )}
    </div>
  )
}

interface McdArticleDetailProps {
  document: McdArticleDocument
  contractors: McdContractor[]
  responseToComments?: McdResponseToComment[]
}

export const McdArticleDetail: React.FC<McdArticleDetailProps> = ({ document, contractors, responseToComments }) => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{document.title}</h1>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <span className='inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'>
                Article
              </span>
              <span className='inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                {document.status}
              </span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>ID: {document.display_id}</span>
            </div>
          </div>
        </div>
        {document.description && (
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'
            dangerouslySetInnerHTML={{ __html: document.description }}
          />
        )}
      </div>

      {/* General Information */}
      <AccordionSection title='General Information' icon={<FiFileText className='h-5 w-5' />} defaultOpen>
        <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
          <InfoRow label='Article ID' value={document.article_id} />
          <InfoRow label='Article Type' value={document.article_type} />
          <InfoRow label='Publication Date' value={document.article_pub_date} />
          <InfoRow label='Effective Date' value={document.article_eff_date} />
          <InfoRow label='Key Article' value={document.key_article} />
          <InfoRow label='CMS Coverage Policy' value={document.cms_cov_policy} />
        </dl>
      </AccordionSection>

      {/* Contractors */}
      {contractors && contractors.length > 0 && (
        <AccordionSection title='Contractors' icon={<FiUsers className='h-5 w-5' />}>
          <div className='space-y-4'>
            {contractors.map((contractor, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3/50'
              >
                <h3 className='font-semibold text-gray-900 dark:text-white'>{contractor.name}</h3>
                <div className='mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>Type: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.type}</span>
                  </div>
                  {/* <div>
                    <span className='text-gray-500 dark:text-gray-400'>ID: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.id}</span>
                  </div> */}
                  {/* <div>
                    <span className='text-gray-500 dark:text-gray-400'>Jurisdiction: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.jurisdiction}</span>
                  </div> */}
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>States: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* Response to Comments */}
      {responseToComments && responseToComments.length > 0 && (
        <AccordionSection title='Response to Comments' icon={<FiMessageCircle className='h-5 w-5' />} defaultOpen>
          <div className='space-y-4'>
            {responseToComments.map((item, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3/50'
              >
                <div className='mb-4'>
                  <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                    Comment
                  </div>
                  <div
                    className='prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100'
                    dangerouslySetInnerHTML={{ __html: item.comment }}
                  />
                </div>
                <div>
                  <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-primary'>Response</div>
                  <div
                    className='prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'
                    dangerouslySetInnerHTML={{ __html: item.response }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* Additional Information */}
      {(document.other_comments || document.sad_url || document.source_article_id || document.reference_article) && (
        <AccordionSection title='Additional Information' icon={<FiFileText className='h-5 w-5' />}>
          <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
            <InfoRow label='Other Comments' value={document.other_comments} renderAsHtml />
            <InfoRow label='SAD URL' value={document.sad_url} />
            <InfoRow label='Source Article ID' value={document.source_article_id} />
            <InfoRow label='Reference Articles' value={document.reference_article} />
            <InfoRow label='30% Rule' value={document.thirty_percent} />
          </dl>
        </AccordionSection>
      )}
    </div>
  )
}

interface McdLcdDetailProps {
  document: McdLcdDocument
  contractors: McdContractor[]
}

export const McdLcdDetail: React.FC<McdLcdDetailProps> = ({ document, contractors }) => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{document.title}</h1>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <span className='inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                LCD
              </span>
              <span className='inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                {document.status}
              </span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>ID: {document.display_id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* General Information */}
      <AccordionSection title='General Information' icon={<FiFileText className='h-5 w-5' />} defaultOpen>
        <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
          <InfoRow label='LCD ID' value={document.lcd_id} />
          <InfoRow label='Version' value={document.lcd_version} />
          <InfoRow label='Determination Number' value={document.determination_number} />
          <InfoRow label='CMS Coverage Policy' value={document.cms_cov_policy} />
          <InfoRow label='Original Effective Date' value={document.orig_det_eff_date} />
          <InfoRow label='Revision Effective Date' value={document.rev_eff_date} />
          <InfoRow label='Revision End Date' value={document.rev_end_date} />
          <InfoRow label='Last Reviewed' value={document.last_reviewed_on} />
        </dl>
      </AccordionSection>

      {/* Contractors */}
      {contractors && contractors.length > 0 && (
        <AccordionSection title='Contractors' icon={<FiUsers className='h-5 w-5' />}>
          <div className='space-y-4'>
            {contractors.map((contractor, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3/50'
              >
                <h3 className='font-semibold text-gray-900 dark:text-white'>{contractor.name}</h3>
                <div className='mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>Type: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.type}</span>
                  </div>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>ID: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.id}</span>
                  </div>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>Jurisdiction: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.jurisdiction}</span>
                  </div>
                  <div>
                    <span className='text-gray-500 dark:text-gray-400'>States: </span>
                    <span className='text-gray-900 dark:text-gray-100'>{contractor.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* Coverage Determination */}
      <AccordionSection title='Coverage Determination' icon={<FiFileText className='h-5 w-5' />} defaultOpen>
        <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
          <InfoRow label='Indication' value={document.indication} renderAsHtml />
          <InfoRow label='Issue' value={document.issue} renderAsHtml />
          <InfoRow label='Issue Change' value={document.issue_change} renderAsHtml />
        </dl>
      </AccordionSection>

      {/* Diagnoses */}
      <AccordionSection title='Diagnoses' icon={<FiFileText className='h-5 w-5' />} defaultOpen>
        <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
          <InfoRow label='Diagnoses that Support Coverage' value={document.diagnoses_support} renderAsHtml />
          <InfoRow
            label='Diagnoses that Do NOT Support Coverage'
            value={document.diagnoses_dont_support}
            renderAsHtml
          />
          <InfoRow label='ICD-10 Documentation' value={document.icd10_doc} renderAsHtml />
          <InfoRow label='Additional ICD-10 Info' value={document.add_icd10_info} renderAsHtml />
        </dl>
      </AccordionSection>

      {/* Comments & Meetings */}
      {(document.comment_start_dt || document.adv_meeting || document.draft_contact) && (
        <AccordionSection title='Comments & Meetings' icon={<FiMessageCircle className='h-5 w-5' />}>
          <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
            <InfoRow label='Comment Period Start' value={document.comment_start_dt} />
            <InfoRow label='Comment Period End' value={document.comment_end_dt} />
            <InfoRow label='Notice Start Date' value={document.notice_start_dt} />
            <InfoRow label='Notice End Date' value={document.notice_end_dt} />
            <InfoRow label='Advisory Meeting' value={document.adv_meeting} />
            <InfoRow label='Draft Released Date' value={document.draft_released_date} />
            <InfoRow label='Draft Contact' value={document.draft_contact} />
          </dl>
        </AccordionSection>
      )}

      {/* Additional Information */}
      <AccordionSection title='Additional Information' icon={<FiFileText className='h-5 w-5' />}>
        <dl className='divide-y divide-gray-100 dark:divide-dark-3'>
          <InfoRow label='Keywords' value={document.keywords} />
          <InfoRow label='Associated Information' value={document.associated_info} renderAsHtml />
          <InfoRow label='Appendices' value={document.appendices} renderAsHtml />
          <InfoRow label='Source LCD ID' value={document.source_lcd_id} />
          <InfoRow label='MAC Initiated' value={document.mac_initiated} />
          <InfoRow label='30% Rule' value={document.thirty_percent} />
          <InfoRow label='Last Updated' value={document.last_updated} />
        </dl>
      </AccordionSection>
    </div>
  )
}
