export const LOAN_MODE_OF_PAYMENT = [
    'day',
    'daily',
    'weekly',
    'semi-monthly',
    'monthly',
    'quarterly',
    'semi-annual',
    'lumpsum',
] as const

export const WEEKDAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
] as const

export const LOAN_COLLECTOR_PLACE = ['office', 'field'] as const

export const LOAN_COMAKER_TYPE = [
    'none',
    'member',
    'deposit',
    'others',
] as const

export const LOAN_TYPE = [
    'standard',
    'restructured',
    'standard previous',
    'renewal',
    'renewal without deduction',
] as const

export const LOAN_AMORTIZATION_TYPE = ['suggested', 'none'] as const

export const COMPUTATION_TYPE = [
    'Straight',
    'Diminishing',
    'Diminishing Straight',
] as const

export const COMPUTATION_TYPE_DESCRIPTIONS = {
    Straight:
        'Interest is calculated on the full principal amount throughout the entire loan term.',
    Diminishing:
        'Interest is calculated on the remaining principal balance, which decreases with each payment.',
    'Diminishing Straight':
        'A hybrid approach combining elements of both diminishing and straight methods.',
} as const

export const LOAN_ADJUSTMENT_TYPE = ['add', 'deduct'] as const
