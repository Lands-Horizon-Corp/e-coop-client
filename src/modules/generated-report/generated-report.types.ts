import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IGeneratedReportsDownloadUsers } from '../generated-reports-download-users/generated-reports-download-users.types'
import { IMedia } from '../media'
import { IUser } from '../user'
import { TPaperSizeName } from './components/forms/paper-size-selector'
import { TGeneratedReportSchema } from './generated-report.validation'
import {
    ACCOUNT_MODEL_NAMES,
    PAPER_SIZES,
    PAPER_SIZE_UNIT,
} from './generated-reports.constants'

export type TModelName = (typeof ACCOUNT_MODEL_NAMES)[number]

export type TModeGeneratedReport =
    | 'me-search'
    | 'me-pdf'
    | 'me-favorites'
    | 'me-excel'
    | 'pdf'
    | 'favorites'
    | 'excel'
    | 'me-model'
    | 'search'
    | 'me'

export const GENERATE_REPORT_TYPE = ['pdf', 'excel'] as const

export type TGeneratedReportType = (typeof GENERATE_REPORT_TYPE)[number]

export type TGeneratedReportStatus =
    | 'pending'
    | 'in_progress'
    | 'formatting'
    | 'uploading'
    | 'completed'
    | 'failed'

export interface IGeneratedReport extends IBaseEntityMeta {
    user_id: TEntityId
    user: IUser
    media_id: TEntityId
    media: IMedia
    name: string
    description: string

    status: TGeneratedReportStatus
    progress: number
    system_message: string

    filter_search: string
    is_favorite: boolean
    model: TModelName
    url: string
    generated_report_type: TGeneratedReportType
    paper_size?: string
    template?: string

    has_password?: boolean

    download_users: IGeneratedReportsDownloadUsers[]

    width: number
    height: number
    unit: TPaperSizeUnit

    expiration_days?: number

    landscape: boolean
}

export interface IGeneratedReportRequest extends TGeneratedReportSchema {}

export interface IPFGeneratedReport extends IGeneratedReport {}
export interface IExcelGeneratedReport extends IGeneratedReport {}

export interface IGeneratedReportPaginated extends IPaginatedResult<IGeneratedReport> {}

export interface IGeneratedReportUpdateRequest {
    name: string
    description: string
}

export interface IGeneratedReportAvailableModalResponse {
    model: TModelName
    count: number
}

export type TemplateOptions = {
    value?: string
    label?: string
    description?: string

    defaultSize: TPaperSizeName
}

// for template & preview

export type TPaperSizeUnit = (typeof PAPER_SIZE_UNIT)[number]

export interface GeneratedReportTemplate<T = unknown> {
    id: string
    template_name: string

    template: string

    // niremove ko dahil contradicting to sa input and changeable unit.
    // example max-width dito is 14in, pag binago ko unit to mm, 14mm lang allowable which is too small
    // kaya remove nalang

    // max_width: number
    // max_height: number
    // min_width: number
    // min_height: number

    default_unit: TPaperSizeUnit
    model: TModelName

    width: string // combined ng value sa default sizing unit 18in
    height: string // combined ng value sa default sizing unit 14in

    page_size?: (typeof PAPER_SIZES)[number]

    preview_data: T

    lock_organization_id?: TEntityId[]
    lock_branch_id?: TEntityId[]
}

export type GeneratedReportTemplateCollection = GeneratedReportTemplate[]

// COMMON REPORT TEMPLATE INJECTABLE DATA

export interface IBaseReportTemplateData {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    print_count?: number
}

export interface IBaseReportTemplateCheck {
    check_number?: string
    check_date?: string
}
