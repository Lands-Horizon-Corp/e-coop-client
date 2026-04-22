export const GENERAL_LEDGER_TYPE = [
    'Assets',
    'Liabilities',
    'Equity',
    'Revenue',
    'Expenses',
] as const

export const GENERAL_LEDGER_SOURCES = [
    'withdraw',
    'deposit',
    'journal',
    'payment', // collection
    'adjustment',
    'journal voucher',
    'check voucher', // disbursement
    'loan',
    'savings interest',
    'mutual contribution',
    'disbursement',
    'blotter',
    'other fund',
] as const

// Used in UI/Form select at sa zod validation
export const GL_BOOKS = {
    daily_collection: 'Daily Collection Book',
    cash_check_disbursement: 'Cash Check Disbursement Book',
    general_journal: 'General Journal',
    general_ledger: 'General Ledger',
} as const

export type TGLBook = keyof typeof GL_BOOKS
