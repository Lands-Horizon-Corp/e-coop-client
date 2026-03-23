import { GeneratedReportTemplate } from '@/modules/generated-report'

import LT_LRV_A from './templates/lt-lrv-a5.njk?raw'
import LT_LRV_BANK_BOOK from './templates/lt-lrv-bank-book.njk?raw'
import LT_LRV_STATEMENT from './templates/lt-lrv-statement.njk?raw'

export interface ILoanReleaseVoucherTemplate {
    // Header
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    // Info grid
    pay_to: string
    account_number: string
    contact: string
    voucher_no: string
    date_release: string
    terms: number
    collection: string
    mode_of_payment: string
    processor: string
    due_date: string

    // Loan transactions
    loan_transaction_entries: Array<{
        account_title: string
        debit: number | string
        credit: number | string
        is_highlighted?: boolean
    }>

    // Totals
    total_debit: number | string
    total_credit: number | string
    total_amount_in_words: string

    // Check details
    check_date: string
    check_number: string

    // Signatures
    prepared_by: string
    verified_by: string
    approved_by: string
    posted_by: string
    received_by: string
}

export const SHARED_LOAN_PREVIEW_DATA: ILoanReleaseVoucherTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Main Street, Sample City',
    tax_number: '000-000-000-000',
    report_title: 'LOAN RELEASE VOUCHER',

    pay_to: 'Juan Dela Cruz',
    account_number: '12345678',
    contact: '09171234567',
    voucher_no: 'LRV-2024-001',
    date_release: '2024-01-15',
    terms: 12,
    collection: 'Office',
    mode_of_payment: 'Monthly',
    processor: 'Maria Santos',
    due_date: '2025-01-15',

    loan_transaction_entries: [
        {
            account_title: 'Loans Receivable',
            debit: 50000,
            credit: '',
            is_highlighted: true,
        },
        { account_title: 'Service Fee Income', debit: '', credit: 1500 },
        { account_title: 'Insurance Fund', debit: '', credit: 500 },
        { account_title: 'Share Capital', debit: '', credit: 2000 },
    ],

    total_debit: 50000,
    total_credit: 50000,
    total_amount_in_words: 'FORTY-SIX THOUSAND PESOS',

    check_date: '2024-01-15',
    check_number: '000123',

    prepared_by: 'Ana Reyes',
    verified_by: 'Maria Santos',
    approved_by: 'Luis Gonzales',
    posted_by: 'Luis Gonzales',
    received_by: 'Juan Dela Cruz',
}

export const LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES: GeneratedReportTemplate<ILoanReleaseVoucherTemplate>[] =
    [
        {
            id: 'lt-lrv-a5',
            template_name: 'Loan Voucher Release A5',
            model: 'LoanTransaction',
            template: LT_LRV_A,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_LOAN_PREVIEW_DATA,
        },
        {
            id: 'lt-lrv-bank-book',
            template_name: 'Loan Voucher Release Bank Book',
            model: 'LoanTransaction',
            template: LT_LRV_BANK_BOOK,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_LOAN_PREVIEW_DATA,
        },
        {
            id: 'lt-lrv-statement',
            template_name: 'Loan Voucher Release Statement',
            model: 'LoanTransaction',
            template: LT_LRV_STATEMENT,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_LOAN_PREVIEW_DATA,
        },
    ]
