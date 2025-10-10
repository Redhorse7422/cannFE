export interface McdResult {
  document_type: string
  document_id: string
  title: string
  status: string
}

export interface McdPagination {
  page: number | string
  limit: string | number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface McdFilters {
  keyword: string
  documentType: string
}

export interface McdSearchResponse {
  results: McdResult[]
  pagination: McdPagination
  filters: McdFilters
}

// Detail Page Types
export interface McdContractor {
  id: string
  name: string
  type: string
  jurisdiction: string
  state: string
}

export interface McdResponseToComment {
  comment: string
  response: string
}

export interface McdArticleDocument {
  id: number
  article_id: string
  article_version: string
  article_type: string
  title: string
  article_pub_date: string
  article_eff_date: string
  article_end_date: string | null
  description: string
  other_comments: string
  sad_url: string
  thirty_percent: string
  status: string
  last_updated: string
  history_exp: string
  key_article: string
  icd9_covered_para: string | null
  icd9_noncovered_para: string | null
  revenue_para: string
  article_rev_end_date: string | null
  source_article_id: string
  date_retired: string | null
  keywords: string
  icd10_doc: string
  add_icd10_info: string
  cms_cov_policy: string
  display_id: string
  reference_article: string
  mdb_source: string
  imported_at: string
}

export interface McdLcdDocument {
  id: number
  lcd_id: string
  lcd_version: string
  display_id: string
  title: string
  determination_number: string
  cms_cov_policy: string
  orig_det_eff_date: string
  ent_det_end_date: string | null
  rev_eff_date: string
  rev_end_date: string | null
  indication: string
  diagnoses_support: string
  icd9_dont_support_para: string | null
  icd9_dont_support_ast: string | null
  diagnoses_dont_support: string
  coding_guidelines: string
  doc_reqs: string
  appendices: string
  util_guide: string
  source_info: string
  adv_meeting: string
  comment_start_dt: string
  comment_end_dt: string
  notice_start_dt: string
  rev_hist_num: string
  history_exp: string
  last_reviewed_on: string
  thirty_percent: string
  status: string
  last_updated: string
  draft_contact: string
  revenue_para: string
  source_lcd_id: string
  add_icd10_info: string
  keywords: string
  associated_info: string
  notice_end_dt: string
  date_retired: string | null
  draft_released_date: string
  icd10_doc: string
  synopsis_changes: string
  bibliography: string
  summary_of_evidence: string
  analysis_of_evidence: string
  mcd_publish_date: string
  issue: string
  issue_change: string
  mac_initiated: string
  mdb_source: string
  imported_at: string
}

export interface McdArticleDetailResponse {
  message: string
  requestId: string
  data: {
    document: McdArticleDocument
    related: {
      contractors: McdContractor[]
      responseToComments?: McdResponseToComment[]
    }
  }
  code: number
}

export interface McdLcdDetailResponse {
  message: string
  requestId: string
  data: {
    document: McdLcdDocument
    related: {
      contractors: McdContractor[]
    }
  }
  code: number
}

