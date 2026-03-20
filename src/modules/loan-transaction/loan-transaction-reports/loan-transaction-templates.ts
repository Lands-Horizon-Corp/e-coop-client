import { GeneratedReportTemplate } from '@/modules/generated-report'

import LT_LRV_A from './templates/lt-lrv-a5.njk?raw'
import LT_LRV_BANK_BOOK from './templates/lt-lrv-bank-book.njk?raw'
import LT_LRV_RESPONSIVE from './templates/lt-lrv-responsive.njk?raw'
import LT_LRV_STATEMENT from './templates/lt-lrv-statement.njk?raw'

export interface ILoanReleaseVoucherTemplate {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string

    pay_to: string
    account_number: string
    contact: string
    voucher_no: string
    date_release: string
    terms: number
    mode_of_payment: string
    processor: string
    due_date: string

    loan_transaction_entries: Array<{
        account_title: string
        debit: number | string
        credit: number | string
        is_highlighted?: boolean
    }>

    cash_on_hand_total_debit?: number | string
    cash_on_hand_total_credit?: number | string
    total_debit: number | string
    total_credit: number | string
    total_amount_in_words: string

    prepared_by: string
    payeee: string
    cetified_correct: string
    paid_by: string

    approved_for_payment: string
}

export const LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES: GeneratedReportTemplate<ILoanReleaseVoucherTemplate>[] =
    [
        {
            id: 'lt-lrv-a5',
            template_name: 'Loan Release A',
            model: 'LoanTransaction',

            template: LT_LRV_A,

            default_unit: 'in',
            width: '8.5in',
            height: '11in',

            preview_data: {
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
                    {
                        account_title: 'Service Fee Income',
                        debit: '',
                        credit: 1500,
                    },
                    { account_title: 'Insurance Fund', debit: '', credit: 500 },
                    { account_title: 'Share Capital', debit: '', credit: 2000 },
                ],

                cash_on_hand_total_debit: 50000,
                cash_on_hand_total_credit: 46000,

                total_debit: 50000,
                total_credit: 50000,

                total_amount_in_words: 'FORTY-SIX THOUSAND PESOS',

                prepared_by: 'Ana Reyes',
                payeee: 'Juan Dela Cruz',
                cetified_correct: 'Maria Santos',
                paid_by: 'Luis Gonzales',
                approved_for_payment: 'CFO Approved',
            },
        },

        {
            id: 'lt-lrv-bank-book',
            template_name: 'Loan Release Bank Book',
            model: 'LoanTransaction',

            template: LT_LRV_BANK_BOOK,

            default_unit: 'mm',
            width: '125mm',
            height: '176mm',

            preview_data: {
                header_title: 'SAMPLE COOPERATIVE',
                header_address: '123 Main Street, Sample City',
                tax_number: '000-000-000-000',
                report_title: 'LOAN RELEASE VOUCHER',

                pay_to: 'Juan Dela Cruz',
                account_number: '12345678',
                contact: '09171234567',
                voucher_no: 'LRV-2024-002',
                date_release: '2024-02-10',
                terms: 18,
                mode_of_payment: 'Monthly',
                processor: 'Maria Santos',
                due_date: '2025-08-10',

                loan_transaction_entries: [
                    {
                        account_title: 'Loans Receivable',
                        debit: 60000,
                        credit: '',
                        is_highlighted: true,
                    },
                    {
                        account_title: 'Service Fee Income',
                        debit: '',
                        credit: 1800,
                    },
                    { account_title: 'Insurance Fund', debit: '', credit: 600 },
                    { account_title: 'Share Capital', debit: '', credit: 2600 },
                ],

                cash_on_hand_total_debit: 60000,
                cash_on_hand_total_credit: 55000,

                total_debit: 60000,
                total_credit: 60000,

                total_amount_in_words: 'FIFTY-FIVE THOUSAND PESOS',

                prepared_by: 'Ana Reyes',
                payeee: 'Juan Dela Cruz',
                cetified_correct: 'Maria Santos',
                paid_by: 'Luis Gonzales',
                approved_for_payment: 'CFO Approved',
            },
        },

        {
            id: 'lt-lrv-responsive',
            template_name: 'Loan Release Responsive',
            model: 'LoanTransaction',

            template: LT_LRV_RESPONSIVE,

            default_unit: 'in',
            width: '8.5in',
            height: '11in',

            preview_data: {
                header_title: 'SAMPLE COOPERATIVE',
                header_address: '123 Main Street, Sample City',
                tax_number: '000-000-000-000',
                report_title: 'LOAN RELEASE VOUCHER',

                pay_to: 'Juan Dela Cruz',
                account_number: '12345678',
                contact: '09171234567',
                voucher_no: 'LRV-2024-003',
                date_release: '2024-03-05',
                terms: 24,
                mode_of_payment: 'Monthly',
                processor: 'Maria Santos',
                due_date: '2026-03-05',

                loan_transaction_entries: [
                    {
                        account_title: 'Loans Receivable',
                        debit: 75000,
                        credit: '',
                        is_highlighted: true,
                    },
                    {
                        account_title: 'Service Fee Income',
                        debit: '',
                        credit: 2250,
                    },
                    { account_title: 'Insurance Fund', debit: '', credit: 750 },
                    { account_title: 'Share Capital', debit: '', credit: 3000 },
                ],

                cash_on_hand_total_debit: 75000,
                cash_on_hand_total_credit: 69000,

                total_debit: 75000,
                total_credit: 75000,

                total_amount_in_words: 'SIXTY-NINE THOUSAND PESOS',

                prepared_by: 'Ana Reyes',
                payeee: 'Juan Dela Cruz',
                cetified_correct: 'Maria Santos',
                paid_by: 'Luis Gonzales',
                approved_for_payment: 'CFO Approved',
            },
        },

        {
            id: 'lt-lrv-statement',
            template_name: 'Loan Release Statement',
            model: 'LoanTransaction',

            template: LT_LRV_STATEMENT, // ← make sure you imported this

            default_unit: 'in',
            width: '8.5in',
            height: '11in',

            preview_data: {
                header_title: 'SAMPLE COOPERATIVE',
                header_address: '123 Main Street, Sample City',
                tax_number: '000-000-000-000',
                report_title: 'LOAN RELEASE STATEMENT',

                pay_to: 'Juan Dela Cruz',
                account_number: '12345678',
                contact: '09171234567',
                voucher_no: 'LRV-2024-004',
                date_release: '2024-04-01',
                terms: 36,
                mode_of_payment: 'Monthly',
                processor: 'Maria Santos',
                due_date: '2027-04-01',

                loan_transaction_entries: [
                    {
                        account_title: 'Loans Receivable',
                        debit: 100000,
                        credit: '',
                        is_highlighted: true,
                    },
                    {
                        account_title: 'Service Fee Income',
                        debit: '',
                        credit: 3000,
                    },
                    {
                        account_title: 'Insurance Fund',
                        debit: '',
                        credit: 1000,
                    },
                    { account_title: 'Share Capital', debit: '', credit: 5000 },
                ],

                cash_on_hand_total_debit: 100000,
                cash_on_hand_total_credit: 91000,

                total_debit: 100000,
                total_credit: 100000,

                total_amount_in_words: 'NINETY-ONE THOUSAND PESOS',

                prepared_by: 'Ana Reyes',
                payeee: 'Juan Dela Cruz',
                cetified_correct: 'Maria Santos',
                paid_by: 'Luis Gonzales',
                approved_for_payment: 'CFO Approved',
            },
        },
    ]
