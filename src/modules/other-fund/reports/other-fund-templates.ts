import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import OF_A5 from './templates/of-a5.njk?raw'

// import OF_BANKBOOK from './templates/of-bankbook.njk?raw'
// import OF_STATEMENT from './templates/of-statement.njk?raw'

export interface IOtherFundPrintTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    member_name: string
    member_address?: string
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

    member_name: 'ABAAG, BENITA',
    member_address: 'Blk 4, Lt 8, #412 Laloma QC',
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
            id: 'of-a5',
            template_name: 'Other Fund Voucher A5',
            model: 'OtherFund',
            template: OF_A5,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
        {
            id: 'of-legal',
            template_name: 'Other Fund Voucher Bankbook',
            model: 'OtherFund',
            template: OF_A5,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
        {
            id: 'of-letter',
            template_name: 'Other Fund Voucher Statement',
            model: 'OtherFund',
            template: OF_A5,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_OF_PREVIEW_DATA,
        },
    ]
