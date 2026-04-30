import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IGeneratedReportsDownloadUsers } from '../generated-reports-download-users/generated-reports-download-users.types'
import { IMedia } from '../media'
import { IUser } from '../user'
import { TPaperSizeName } from './components/forms/paper-size-selector'
import { TGeneratedReportSchema } from './generated-report.validation'
import {
    DISPLAY_DENSITY,
    PAPER_ORIENTATION,
    PAPER_SIZES,
    PAPER_SIZE_UNIT,
    REPORT_NAMES,
} from './generated-reports.constants'

export type TReportName = (typeof REPORT_NAMES)[number]

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
    model: TReportName
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
    model: TReportName
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

export type TPaperOrientation = (typeof PAPER_ORIENTATION)[number]

export interface GeneratedReportTemplate<
    T = unknown,
    TTemplateFilter = unknown,
> {
    id: string
    template_name: string

    template: string
    template_filter?: TTemplateFilter // contains static filter config based on template that the form template can't override

    default_unit: TPaperSizeUnit
    report_name: TReportName

    width: string // combined ng value sa default sizing unit 18in
    height: string // combined ng value sa default sizing unit 14in

    page_size?: (typeof PAPER_SIZES)[number]

    preview_data: T

    density: TDisplayDensity
    orientation: TPaperOrientation

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

    density?: TDisplayDensity

    print_count?: number
}

export interface IBaseReportTemplateCheck {
    check_number?: string
    check_date?: string
}

export type TDisplayDensity = (typeof DISPLAY_DENSITY)[number]
