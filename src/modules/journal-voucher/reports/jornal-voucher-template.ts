import {
    GeneratedReportTemplate,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import JV_A5 from './templates/jv-a5.njk?raw'
import JV_BANKBOOK from './templates/jv-bankbook.njk?raw'
import JV_STATEMENT from './templates/jv-statement.njk?raw'

export interface IJournalVoucherPrintTemplate extends IBaseReportTemplateData {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    name: string
    particulars: string
    voucher_no: string
    entry_date: string

    account_entries: Array<{
        account_title: string
        debit: number | string
        credit: number | string
        is_highlighted?: boolean
    }>

    total_debit: number | string
    total_credit: number | string

    status: string
    count: number

    prepared_by: string
    approved_by: string

    user_id: string
    report_date: string
    time: string
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

    account_entries: [
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

    status: 'Approved',
    count: 1,

    prepared_by: 'Ana Reyes',
    approved_by: 'Luis Gonzales',

    user_id: 'USR-001',
    report_date: '2024-01-15',
    time: '10:30 AM',
}

export const JOURNAL_VOUCHER_PRINT_TEMPLATES: GeneratedReportTemplate<IJournalVoucherPrintTemplate>[] =
    [
        {
            id: 'jvv-a5',
            template_name: 'Journal Voucher A5',
            model: 'JournalVoucher',
            template: JV_A5,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
        {
            id: 'jvv-legal',
            template_name: 'Journal Voucher Legal',
            model: 'JournalVoucher',
            template: JV_BANKBOOK,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
        {
            id: 'jvv-letter',
            template_name: 'Journal Voucher Letter',
            model: 'JournalVoucher',
            template: JV_STATEMENT,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_JV_PREVIEW_DATA,
        },
    ]
