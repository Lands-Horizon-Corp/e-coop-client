import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import CCV_COMPACT from './templates/ccv-1-compact.njk?raw'
import CCV_LARGE from './templates/ccv-1-large.njk?raw'
import CCV_NORMAL from './templates/ccv-1-normal.njk?raw'

export interface ICashCheckVoucherPrintTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
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

    cash_check_voucher_entries: Array<{
        account_title: string
        description?: string
        debit: number | string
        credit: number | string
    }>

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

        cash_check_voucher_entries: [
            { account_title: 'Loans Receivable', debit: 50000, credit: '' },
            { account_title: 'Service Fee Income', debit: '', credit: 1500 },
            { account_title: 'Insurance Fund', debit: '', credit: 500 },
            { account_title: 'Share Capital', debit: '', credit: 2000 },
        ],

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
            report_name: 'CashCheckVoucher',
            template: CCV_NORMAL,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
        {
            id: 'ccv-bank-book',
            template_name: 'Cash Check Voucher Bank Book',
            report_name: 'CashCheckVoucher',
            template: CCV_COMPACT,
            default_unit: 'mm',
            width: '125mm',
            height: '176mm',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
        {
            id: 'ccv-statement',
            template_name: 'Cash Check Voucher Statement',
            report_name: 'CashCheckVoucher',
            template: CCV_LARGE,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            preview_data: SHARED_CASH_CHECK_PRINT_PREVIEW_DATA,
        },
    ]

// ADD MO DITO TEMPLATE MO
