import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import GL_BOOK_T1 from './templates/gl_bk_t1.njk?raw'

export interface IGLBookReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    book_title: string

    // Entries
    data_entries: Array<{
        date: string
        reference: string
        account_name: string

        debit: number | string
        credit: number | string
        balance: number | string

        particulars: string
        is_highlighted?: boolean
    }>

    // Totals
    total_debit: number | string
    total_credit: number | string
    total_amount_in_words: string

    // Signatures
    prepared_by: string
    approved_by: string
    check_by: string
}

// CONVERT BELOW DATAS
export const SHARED_GL_BOOK_PREVIEW_DATA: IGLBookReportTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Main Street, Sample City',
    tax_number: '000-000-000-000',
    report_title: 'GENERAL LEDGER BOOK',

    start_date: '2024-01-01',
    end_date: '2024-01-31',

    book_title: 'General Ledger',

    data_entries: [
        {
            date: '2024-01-15',
            reference: 'LRV-2024-001',
            account_name: 'Loans Receivable',
            particulars: 'Loan granted to Juan Dela Cruz',
            debit: 50000,
            credit: '',
            balance: 50000,
            is_highlighted: true,
        },
        {
            date: '2024-01-15',
            reference: 'LRV-2024-001',
            account_name: 'Service Fee Income',
            particulars: 'Service fee deduction',
            debit: '',
            credit: 1500,
            balance: 48500,
        },
        {
            date: '2024-01-15',
            reference: 'LRV-2024-001',
            account_name: 'Insurance Fund',
            particulars: 'Insurance deduction',
            debit: '',
            credit: 500,
            balance: 48000,
        },
        {
            date: '2024-01-15',
            reference: 'LRV-2024-001',
            account_name: 'Share Capital',
            particulars: 'Capital contribution',
            debit: '',
            credit: 2000,
            balance: 46000,
        },
    ],

    total_debit: 50000,
    total_credit: 4000,
    total_amount_in_words: 'FORTY-SIX THOUSAND PESOS',

    prepared_by: 'Ana Reyes',
    approved_by: 'Luis Gonzales',
    check_by: 'Maria Santos',

    check_date: '2024-01-15',
    check_number: '000123',

    print_count: 1,
    density: 'normal', // adjust based on your TDisplayDensity
}

export const GL_BOOK_REPORT_TEMPLATES: GeneratedReportTemplate<IGLBookReportTemplate>[] =
    [
        {
            id: 'gl-book-t1',
            template_name: 'GL Books Report ',
            report_name: 'GLBooksReport',
            template: GL_BOOK_T1,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            density: 'normal',
            orientation: 'portrait',
            preview_data: SHARED_GL_BOOK_PREVIEW_DATA,
        },
    ]
