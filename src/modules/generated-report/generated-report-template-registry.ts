import { LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES } from '../loan-transaction/loan-transaction-reports/loan-transaction-templates'

export const REPORT_REGISTRY = {
    loan_transaction_print_voucher: LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES,
} as const

export type GeneratedReportRegistryKey = keyof typeof REPORT_REGISTRY
