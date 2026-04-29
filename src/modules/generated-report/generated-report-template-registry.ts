import { CASH_CHECK_VOUCHER_PRINT_TEMPLATES } from '../cash-check-voucher/reports/cash-check-voucher-templates'
import { ACCOUNT_GENERAL_LEDGER_REPORT_TEMPLATES } from '../general-ledger-definition/reports/account-ledger-report-templates'
import { GL_BOOK_REPORT_TEMPLATES } from '../general-ledger-definition/reports/general-ledger-report-templates'
import { JOURNAL_VOUCHER_PRINT_TEMPLATES } from '../journal-voucher/reports/jornal-voucher-template'
import { LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES } from '../loan-transaction/reports/loan-transaction-templates'
import { OTHER_FUND_PRINT_TEMPLATES } from '../other-fund/reports/other-fund-templates'
import NO_TEMPLATE from './defaults/no-template.njk?raw'
import { IGeneratedReportRequest } from './generated-report.types'

// import { IGeneratedReportRequest } from './generated-report.types'

export const REPORT_REGISTRY = {
    loan_transaction_print_voucher: LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES,
    cash_check_print_voucher: CASH_CHECK_VOUCHER_PRINT_TEMPLATES,
    journal_voucher_print_template: JOURNAL_VOUCHER_PRINT_TEMPLATES,
    other_fund_print_template: OTHER_FUND_PRINT_TEMPLATES,

    // GLFS
    gl_books_report_template: GL_BOOK_REPORT_TEMPLATES,
    gl_account_report_template: ACCOUNT_GENERAL_LEDGER_REPORT_TEMPLATES,
} as const

export const getTemplateAt = <T>(
    arr: T[] | undefined,
    index: number
): Partial<T> => {
    return (
        arr?.[index] ??
        ({
            template: NO_TEMPLATE,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            orientation: 'portrait',
            report_name: 'none',
            filters: {},
            display_density: 'normal',
            generated_report_type: 'pdf',
            name: 'unknown-report',
            unit: 'in',
        } as IGeneratedReportRequest as T)
    )
}

export type GeneratedReportRegistryKey = keyof typeof REPORT_REGISTRY
