import { CASH_CHECK_VOUCHER_PRINT_TEMPLATES } from '../cash-check-voucher/reports/cash-check-voucher-templates'
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
            module: 'GeneratedReport',
            filters: {},
            generated_report_type: 'pdf',
            name: 'unknown-report',
            unit: 'in',
        } as IGeneratedReportRequest as T)
    )
}

export type GeneratedReportRegistryKey = keyof typeof REPORT_REGISTRY
