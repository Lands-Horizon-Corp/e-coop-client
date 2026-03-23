import { GeneratedReportTemplate } from '@/modules/generated-report'

import CCV_A5 from './templates/ccv-A5.njk?raw'
import CCV_BANK_BOOK from './templates/ccv-bankbook.njk?raw'
import CCV_STATEMENT from './templates/ccv-statement.njk?raw'

export interface ICashCheckVoucherPrintTemplate {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    pay_to: string
    address: string
    particulars: string
    voucher_no: string
    entry_date: string
    date: string

    account_entries: Array<{
        account_title: string
        debit: number | string
        credit: number | string
    }>

    cash_on_hand_total_debit?: number | string
    cash_on_hand_total_credit?: number | string

    total_debit: number | string
    total_credit: number | string
    total_amount_into_words: string

    check_date: string
    check_number: string

    prepared_by: string
    payee: string
    certified_correct: string
    paid_by: string
    approved_for_payment: string
}

export const SHARED_CASH_CHECK_PRINT_PREVIEW_DATA: ICashCheckVoucherPrintTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'CASH CHECK VOUCHER',

        pay_to: 'Juan Dela Cruz',
        address: '456 Sample Street, Sample City',
        particulars: 'Loan Release Proceeds',
        voucher_no: 'CCV-2024-001',
        entry_date: '2024-01-15',
        date: '2024-01-15',

        account_entries: [
            { account_title: 'Loans Receivable', debit: 50000, credit: '' },
            { account_title: 'Service Fee Income', debit: '', credit: 1500 },
            { account_title: 'Insurance Fund', debit: '', credit: 500 },
            { account_title: 'Share Capital', debit: '', credit: 2000 },
        ],

        cash_on_hand_total_debit: 50000,
        cash_on_hand_total_credit: 46000,

        total_debit: 50000,
        total_credit: 50000,
        total_amount_into_words: 'FORTY-SIX THOUSAND PESOS',

        check_date: '2024-01-15',
        check_number: '000123',

        prepared_by: 'Ana Reyes',
        payee: 'Juan Dela Cruz',
        certified_correct: 'Maria Santos',
        paid_by: 'Luis Gonzales',
        approved_for_payment: 'CFO Approved',
    }

export const CASH_CHECK_VOUCHER_PRINT_TEMPLATES: GeneratedReportTemplate<ICashCheckVoucherPrintTemplate>[] =
    [
        {
            id: 'ccv-a5',
            template_name: 'Cash Check Voucher A5',
            model: 'CashCheckVoucher',
            template: CCV_A5,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
        {
            id: 'ccv-bank-book',
            template_name: 'Cash Check Voucher Bank Book',
            model: 'CashCheckVoucher',
            template: CCV_BANK_BOOK,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
        {
            id: 'ccv-statement',
            template_name: 'Cash Check Voucher Statement',
            model: 'CashCheckVoucher',
            template: CCV_STATEMENT,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
    ]

// ADD MO DITO TEMPLATE MO
