export const ACCOUNT_TRANSACTION_SOURCE = [
    'daily_collection_book',
    'cash_check_disbursement_book',
    'general_journal',
] as const

export const ACCOUNT_TRANSACTION_SOURCE_LABEL_MAP: Record<
    (typeof ACCOUNT_TRANSACTION_SOURCE)[number],
    string
> = {
    cash_check_disbursement_book: 'Cash Check Disbursement Book',
    daily_collection_book: 'Daily Collection Book',
    general_journal: 'General Journal',
}
