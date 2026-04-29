import {
    GeneratedReportTemplate,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import JV_COMPACT from './templates/jv-1-compact.njk?raw'
import JV_LARGE from './templates/jv-1-large.njk?raw'
import JV_NORMAL from './templates/jv-1-normal.njk?raw'

export interface IJournalVoucherPrintTemplate extends IBaseReportTemplateData {
    name: string
    particulars: string
    voucher_no: string
    entry_date: string

    journal_entries: Array<{
        account_title: string
        description?: string
        debit: number | string
        credit: number | string
        is_highlighted?: boolean
    }>

    total_debit: number | string
    total_credit: number | string

    prepared_by: string
    approved_by: string
}

export const SHARED_JV_PREVIEW_DATA: IJournalVoucherPrintTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Main Street, Sample City',
    tax_number: '000-000-000-000',
    report_title: 'JOURNAL VOUCHER',

    name: 'Juan Dela Cruz',
    particulars: 'Loan release for January 2024',
    voucher_no: 'JV-2024-001',
    entry_date: '2024-01-15',

    journal_entries: [
        {
            account_title: 'Cash on Hand',
            debit: 5000,
            credit: '',
            is_highlighted: true,
        },
        { account_title: 'Loans Receivable', debit: '', credit: 5000 },
        { account_title: 'Service Fee Income', debit: '', credit: 150 },
        { account_title: 'Insurance Fund', debit: '', credit: 50 },
    ],

    total_debit: 5000,
    total_credit: 5200,

    print_count: 1,

    prepared_by: 'Ana Reyes',
    approved_by: 'Luis Gonzales',
}

export const JOURNAL_VOUCHER_PRINT_TEMPLATES: GeneratedReportTemplate<IJournalVoucherPrintTemplate>[] =
    [
        {
            id: 'jvv-1-normal',
            template_name: 'Journal Voucher Normal',
            report_name: 'JournalVoucherRelease',
            template: JV_NORMAL,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
        {
            id: 'jvv-1-compact',
            template_name: 'Journal Voucher Compact',
            report_name: 'JournalVoucherRelease',
            template: JV_COMPACT,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
        {
            id: 'jvv-1-large',
            template_name: 'Journal Voucher Large',
            report_name: 'JournalVoucherRelease',
            template: JV_LARGE,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
    ]
