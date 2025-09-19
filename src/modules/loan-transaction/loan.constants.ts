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
    'Diminishing Add-On',
    'Diminishing Yearly',
    'Diminishing Straight',
    'Diminishing Quarterly',
] as const
