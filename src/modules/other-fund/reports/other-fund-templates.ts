import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import OFV_COMPACT from './templates/ofv-1-compact.njk?raw'
import OFV_LARGE from './templates/ofv-1-large.njk?raw'
import OFV_NORMAL from './templates/ofv-1-normal.njk?raw'

export interface IOtherFundPrintTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    name: string
    address?: string
    particulars: string

    voucher_no: string
    entry_date: string
    print_date: string

    other_fund_entries: Array<{
        account_title: string
        description: string
        debit: number | string
        credit: number | string
        is_highlighted?: boolean
    }>

    total_debit: number | string
    total_credit: number | string

    approved_by: string
    certified_by: string
    paid_by: string
    received_by: string
}

export const SHARED_OF_PREVIEW_DATA: IOtherFundPrintTemplate = {
    header_title: 'ALLIEM MULTI-PURPOSE COOPERATIVE',
    header_address: 'Aliem, Ilocos Sur',
    tax_number: '000-549-393-NV',
    report_title: 'OTHER FUND VOUCHER',

    name: 'ABAAG, BENITA',
    address: 'Blk 4, Lt 8, #412 Laloma QC',
    particulars: 'GROCERY',

    voucher_no: '0000000194',
    entry_date: '03/25/2026',
    print_date: '03/25/2026',

    other_fund_entries: [
        {
            account_title: '565.00',
            description: 'AFFILIATION FEES',
            debit: 50,
            credit: '',
            is_highlighted: true,
        },
        {
            account_title: '406.00',
            description: 'FILING FEES',
            debit: '',
            credit: 50,
        },
    ],

    total_debit: 50,
    total_credit: 50,

    print_count: 1,

    approved_by: 'Juan Dela Cruz',
    certified_by: 'Maria Santos',
    paid_by: 'Pedro Reyes',
    received_by: 'ABAAG, BENITA',
}

export const OTHER_FUND_PRINT_TEMPLATES: GeneratedReportTemplate<IOtherFundPrintTemplate>[] =
    [
        {
            id: 'ofv-normal',
            template_name: 'Other Fund Voucher Normal',
            report_name: 'OtherFundRelease',
            template: OFV_NORMAL,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
        {
            id: 'ofv-compact',
            template_name: 'Other Fund Voucher Compact',
            report_name: 'OtherFundRelease',
            template: OFV_COMPACT,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
        {
            id: 'ofv-large',
            template_name: 'Other Fund Voucher Large',
            report_name: 'OtherFundRelease',
            template: OFV_LARGE,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
    ]
