import React, { useEffect, useMemo, useState } from 'react'

import { getMcdDetail } from '@/services/mcd.services'

interface McdDetailPageProps {
  documentType: string
  documentId: string
}

type AnyRecord = Record<string, unknown>

export const McdDetailPage: React.FC<McdDetailPageProps> = ({ documentType, documentId }) => {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contractorInfo: true,
    articleInfo: true,
    lcdInfo: true,
    articleGuidance: true,
    indications: true,
    contractorsTbl: false,
    relatedDocs: false,
    responses: true,
  })

  const toggle = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    getMcdDetail(documentType, documentId)
      .then((res) => {
        if (cancelled) return

        setData(res.data ?? null)
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [documentType, documentId])

  const {
    effectiveId,
    effectiveKind,
    article,
    title,
    descriptionHtml,
    metadata,
    contractors,
    relatedDocs,
    contractorRows,
    articleInfo,
    responseToCommentsRows,
    lcdInfo,
    lcdGeneral,
    lcdIndicationsHtml,
  } = useMemo(() => {
    const root = (data as AnyRecord) || {}
    const tables = (root.tables as AnyRecord) || {}
    // Prefer article table; fallback to first table containing 'article'
    let articleTable = (tables['article'] as Array<AnyRecord>) || []
    if (!Array.isArray(articleTable) || articleTable.length === 0) {
      const altKey = Object.keys(tables).find((k) => k.toLowerCase().includes('article'))
      if (altKey) articleTable = (tables[altKey] as Array<AnyRecord>) || []
    }
    const articleRow = (Array.isArray(articleTable) && articleTable.length > 0 ? articleTable[0] : {}) as AnyRecord

    const titleVal = (articleRow.title as string) || (articleRow.display_id as string) || ''
    const description = (articleRow.description as string) || ''
    const meta = {
      status: (articleRow.status as string) || '',
      article_pub_date: (articleRow.article_pub_date as string) || '',
      article_eff_date: (articleRow.article_eff_date as string) || '',
      article_end_date: (articleRow.article_end_date as string) || '',
      article_type: (articleRow.article_type as number) || undefined,
    }

    const contractorsTable = (tables['article_x_contractor'] as Array<AnyRecord>) || []
    const relatedNcdTable = (tables['article_related_ncd_documents'] as Array<AnyRecord>) || []

    // Collect unhandled tables for generic rendering
    const handled = new Set([
      'article',
      'article_x_contractor',
      'article_related_ncd_documents',
      'article_x_response_to_comment',
    ])
    const extras: Array<{ name: string; rows: Array<AnyRecord> }> = []
    Object.keys(tables).forEach((name) => {
      if (!handled.has(name)) {
        const rows = (tables[name] as Array<AnyRecord>) || []
        if (rows.length > 0) {
          extras.push({ name, rows })
        }
      }
    })

    return {
      effectiveId: (root.id as string) || '',
      effectiveKind: (root.kind as string) || '',
      article: articleRow,
      title: titleVal,
      descriptionHtml: description,
      metadata: meta,
      contractors: contractorsTable,
      relatedDocs: relatedNcdTable,
      // keep extras available for future sections if needed
      // extraTables: extras,
      contractorRows: (root.contractorRows as Array<AnyRecord>) || [],
      articleInfo: (root.articleInfo as AnyRecord | null) ?? null,
      responseToCommentsRows: (root.responseToCommentsRows as Array<AnyRecord>) || [],
      lcdInfo: (root.lcdInfo as AnyRecord) || {},
      lcdGeneral: ((root.lcdInfo as AnyRecord)?.generalInformation as AnyRecord) || {},
      lcdIndicationsHtml: (root.lcdInfo as AnyRecord)?.indications as string | undefined,
    }
  }, [data])

  if (isLoading) return <div className='p-4'>Loading…</div>
  if (error) return <div className='p-4 text-red-600'>{error}</div>

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold text-gray-900'>
          {title || (lcdGeneral && (lcdGeneral.lcdTitle as string)) || `Detail: ${effectiveId || documentId}`}
        </h1>
        <div className='text-sm text-gray-600'>
          <span className='mr-3'>ID: {effectiveId || documentId}</span>
          <span className='mr-3'>Kind: {effectiveKind || documentType}</span>
          {metadata.status && <span className='mr-3'>Status: {metadata.status}</span>}
          {metadata.article_pub_date && (
            <span className='mr-3'>Published: {new Date(metadata.article_pub_date).toLocaleDateString()}</span>
          )}
          {metadata.article_eff_date && (
            <span className='mr-3'>Effective: {new Date(metadata.article_eff_date).toLocaleDateString()}</span>
          )}
          {metadata.article_end_date && <span>End: {new Date(metadata.article_end_date).toLocaleDateString()}</span>}
          {!metadata.article_pub_date && (lcdGeneral as AnyRecord)?.revisionEffectiveDate ? (
            <span className='mr-3'>
              Revision Effective:{' '}
              {new Date(String((lcdGeneral as AnyRecord).revisionEffectiveDate)).toLocaleDateString()}
            </span>
          ) : null}
          {!metadata.article_eff_date && (lcdGeneral as AnyRecord)?.originalEffectiveDate ? (
            <span className='mr-3'>
              Original Effective:{' '}
              {new Date(String((lcdGeneral as AnyRecord).originalEffectiveDate)).toLocaleDateString()}
            </span>
          ) : null}
          {!metadata.article_end_date && (lcdGeneral as AnyRecord)?.retirementDate ? (
            <span>Retirement: {new Date(String((lcdGeneral as AnyRecord).retirementDate)).toLocaleDateString()}</span>
          ) : null}
        </div>
        {((article as AnyRecord)?.article_version !== null && (article as AnyRecord)?.article_version !== undefined) ||
        ((article as AnyRecord)?.article_type !== null && (article as AnyRecord)?.article_type !== undefined) ? (
          <div className='text-xs text-gray-500'>
            {(article as AnyRecord)?.article_version !== null &&
              (article as AnyRecord)?.article_version !== undefined && (
                <span className='mr-3'>Version: {String((article as AnyRecord).article_version)}</span>
              )}
            {(article as AnyRecord)?.article_type !== null && (article as AnyRecord)?.article_type !== undefined && (
              <span>Type: {String((article as AnyRecord).article_type)}</span>
            )}
          </div>
        ) : null}
      </div>

      {/* Contractor Information */}
      {Array.isArray(contractorRows) && contractorRows.length > 0 ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('contractorInfo')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Contractor Information</h2>
            <span className='text-sm text-gray-500'>{openSections.contractorInfo ? '−' : '+'}</span>
          </button>
          {openSections.contractorInfo && (
            <div className='px-4 pb-4'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Contractor Name
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Contract Type
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Contract Number
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Jurisdiction
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        States
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {contractorRows.map((r, idx) => (
                      <tr key={idx}>
                        <td className='px-4 py-2 text-sm'>{String(r.contractorName ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.contractType ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.contractNumber ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.jurisdiction ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.state ?? '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Article Information / General Information */}
      {articleInfo && (articleInfo as AnyRecord).generalInformation ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('articleInfo')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Article Information</h2>
            <span className='text-sm text-gray-500'>{openSections.articleInfo ? '−' : '+'}</span>
          </button>
          {openSections.articleInfo && (
            <div className='px-4 pb-4'>
              <h3 className='mb-2 text-base font-semibold text-gray-800'>General Information</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                {Object.entries(((articleInfo as AnyRecord).generalInformation || {}) as AnyRecord).map(([k, v]) => (
                  <div key={k} className='text-sm'>
                    <div className='text-gray-500'>{k}</div>
                    <div className='text-gray-900'>
                      {typeof v === 'string' || typeof v === 'number'
                        ? String(v)
                        : v === null
                          ? 'N/A'
                          : JSON.stringify(v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* LCD Information / General Information */}
      {lcdInfo && (lcdInfo as AnyRecord).generalInformation ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('lcdInfo')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>LCD Information</h2>
            <span className='text-sm text-gray-500'>{openSections.lcdInfo ? '−' : '+'}</span>
          </button>
          {openSections.lcdInfo && (
            <div className='px-4 pb-4'>
              <h3 className='mb-2 text-base font-semibold text-gray-800'>General Information</h3>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                {Object.entries(((lcdInfo as AnyRecord).generalInformation || {}) as AnyRecord).map(([k, v]) => (
                  <div key={k} className='text-sm'>
                    <div className='text-gray-500'>{k}</div>
                    <div className='text-gray-900'>
                      {typeof v === 'string' || typeof v === 'number'
                        ? String(v)
                        : v === null
                          ? 'N/A'
                          : JSON.stringify(v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Article Guidance / Article Text */}
      {(() => {
        const guidance = (articleInfo as AnyRecord)?.articleGuidance as AnyRecord | undefined
        const text = guidance && (guidance as AnyRecord)['articleText']
        return typeof text === 'string' && text.trim()
      })() ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('articleGuidance')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Article Guidance</h2>
            <span className='text-sm text-gray-500'>{openSections.articleGuidance ? '−' : '+'}</span>
          </button>
          {openSections.articleGuidance && (
            <div className='px-4 pb-4'>
              <h3 className='mb-2 text-base font-semibold text-gray-800'>Article Text</h3>
              {(() => {
                const guidance = (articleInfo as AnyRecord)?.articleGuidance as AnyRecord | undefined
                const text = guidance && (guidance as AnyRecord)['articleText']
                const html = typeof text === 'string' ? text : ''
                return <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: html }} />
              })()}
            </div>
          )}
        </section>
      ) : null}

      {/* LCD Indications */}
      {typeof lcdIndicationsHtml === 'string' && lcdIndicationsHtml.trim().length > 0 ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('indications')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Indications</h2>
            <span className='text-sm text-gray-500'>{openSections.indications ? '−' : '+'}</span>
          </button>
          {openSections.indications && (
            <div className='px-4 pb-4'>
              <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: lcdIndicationsHtml }} />
            </div>
          )}
        </section>
      ) : null}

      {/* Keep legacy description section if present and no articleGuidance provided */}
      {(() => {
        const guidance = (articleInfo as AnyRecord)?.articleGuidance as AnyRecord | undefined
        const text = guidance && (guidance as AnyRecord)['articleText']
        const hasGuidanceHtml = typeof text === 'string' && text.trim().length > 0
        return !hasGuidanceHtml && descriptionHtml
      })() ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <h2 className='mb-3 text-lg font-semibold text-gray-900'>Description</h2>
          <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </section>
      ) : null}

      {/* Contractors Table */}
      {contractors && Array.isArray(contractors) && contractors.length > 0 ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('contractorsTbl')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Contractors</h2>
            <span className='text-sm text-gray-500'>{openSections.contractorsTbl ? '−' : '+'}</span>
          </button>
          {openSections.contractorsTbl && (
            <div className='px-4 pb-4'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Contractor ID
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Type ID
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Version
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {contractors.map((c: AnyRecord, idx: number) => (
                      <tr key={String(c.contractor_id ?? idx)}>
                        <td className='px-4 py-2 text-sm'>{String(c.contractor_id ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(c.contractor_type_id ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(c.contractor_version ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>
                          {c.last_updated ? new Date(String(c.last_updated)).toLocaleString() : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Related NCD Documents */}
      {relatedDocs && Array.isArray(relatedDocs) && relatedDocs.length > 0 ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('relatedDocs')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Related NCD Documents</h2>
            <span className='text-sm text-gray-500'>{openSections.relatedDocs ? '−' : '+'}</span>
          </button>
          {openSections.relatedDocs && (
            <div className='px-4 pb-4'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        Related Num
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        NCD ID
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                        NCD Version
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {relatedDocs.map((r: AnyRecord, idx: number) => (
                      <tr key={String(r.related_num ?? idx)}>
                        <td className='px-4 py-2 text-sm'>{String(r.related_num ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.r_ncd_id ?? '')}</td>
                        <td className='px-4 py-2 text-sm'>{String(r.r_ncd_version ?? '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Response To Comments */}
      {Array.isArray(responseToCommentsRows) && responseToCommentsRows.length > 0 ? (
        <section className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <button
            type='button'
            onClick={() => toggle('responses')}
            className='flex w-full items-center justify-between px-4 py-3 text-left'
          >
            <h2 className='text-lg font-semibold text-gray-900'>Responses to Comments</h2>
            <span className='text-sm text-gray-500'>{openSections.responses ? '−' : '+'}</span>
          </button>
          {openSections.responses && (
            <div className='space-y-6 px-4 pb-4'>
              {responseToCommentsRows.map((r: AnyRecord, idx: number) => (
                <div key={String(r.number ?? idx)} className='rounded-md border border-gray-200 p-4'>
                  <div className='mb-2 text-sm font-semibold text-gray-800'>Number: {String(r.number ?? idx)}</div>
                  {r.comment ? (
                    <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: String(r.comment) }} />
                  ) : null}
                  {r.response ? (
                    <div className='prose mt-3 max-w-none' dangerouslySetInnerHTML={{ __html: String(r.response) }} />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
