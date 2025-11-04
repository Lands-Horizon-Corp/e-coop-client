export const GENERAL_LEDGER_SOURCES = [
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'journal voucher',
    'check voucher',
] as const

export const GENERAL_LEDGER_TYPE = [
    'Assets',
    'Liabilities, Equity & Reserves',
    'Income',
    'Expenses',
] as const
