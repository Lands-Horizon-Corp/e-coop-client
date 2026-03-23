import { CASH_CHECK_VOUCHER_PRINT_TEMPLATES } from '../cash-check-voucher/reports/cash-check-voucher-templates'
import { JOURNAL_VOUCHER_PRINT_TEMPLATES } from '../journal-voucher/reports/jornal-voucher-template'
import { LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES } from '../loan-transaction/reports/loan-transaction-templates'

export const REPORT_REGISTRY = {
    loan_transaction_print_voucher: LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES,
    cash_check_print_voucher: CASH_CHECK_VOUCHER_PRINT_TEMPLATES,
    journal_voucher_print_template: JOURNAL_VOUCHER_PRINT_TEMPLATES,
} as const

export const getTemplateAt = <T>(
    arr: T[] | undefined,
    index: number
): Partial<T> => {
    return arr?.[index] ?? {}
}

export type GeneratedReportRegistryKey = keyof typeof REPORT_REGISTRY
