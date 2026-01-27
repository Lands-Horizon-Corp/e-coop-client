import { buildOR } from '../or-builder'
import {
    ILoanTransactionStatusDates,
    TLoanStatusType,
    TORLoanVoucherSettings,
} from './loan-transaction.types'

export const resolveLoanDatesToStatus = (
    dates: ILoanTransactionStatusDates
): TLoanStatusType => {
    if (dates.released_date) return 'released'
    if (dates.approved_date) return 'approved'
    if (dates.printed_date) return 'printed'
    return 'draft'
}

export const isAllowedInputLoanTransactionOR = (
    orOptions?: TORLoanVoucherSettings
) => {
    if (!orOptions) return true

    return orOptions.check_voucher_general
        ? orOptions.check_voucher_general_allow_user_input
        : orOptions.loan_voucher_allow_user_input
}

export const buildLoanVoucherOR = (orOptions: TORLoanVoucherSettings) => {
    const shouldUseGeneral = orOptions.check_voucher_general

    const padding = shouldUseGeneral
        ? orOptions.check_voucher_general_padding
        : orOptions.loan_voucher_padding

    const currentOr = shouldUseGeneral
        ? orOptions.check_voucher_general_or_current
        : orOptions.loan_voucher_or_current

    const prefix = shouldUseGeneral
        ? orOptions.check_voucher_general_prefix
        : orOptions.loan_voucher_prefix

    return buildOR({ currentOr, prefix, padding })
}
