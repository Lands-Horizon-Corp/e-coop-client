export const TYPES_OF_PAYMENT_TYPES = ['cash', 'check', 'online'] as const;

export const GENERAL_LEDGER_SOURCES = [
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'journal voucher',
    'check voucher',
] as const;

export const GENERAL_LEDGER_DEFINITION_MAX_DEPTH = 3;
