import {
    ILoanTransactionStatusDates,
    TLoanStatusType,
} from './loan-transaction.types'

export const resolveLoanDatesToStatus = (
    dates: ILoanTransactionStatusDates
): TLoanStatusType => {
    if (dates.released_date) return 'released'
    if (dates.approved_date) return 'approved'
    if (dates.printed_date) return 'printed'
    return 'draft'
}
