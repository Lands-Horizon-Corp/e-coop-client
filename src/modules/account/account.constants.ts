export const ACCOUNT_INTEREST_STANDARD_COMPUTATION = [
    'None',
    'Yearly',
    'Monthly',
] as const

export const ACCOUNT_TYPE = [
    'Other',
    'Deposit',
    'Loan',
    'A/R-Ledger',
    'A/R-Aging',
    'Fines',
    'Interest',
    'SVF-Ledger',
    'W-Off',
    'A/P-Ledger',
] as const

export const COMPUTATION_TYPE = [
    'Straight',
    'Diminishing',
    'DiminishingStraight',
] as const

export const LUMPSUM_COMPUTATION_TYPE = [
    'None',
    'Compute Fines Maturity',
    'Compute Interest Maturity / Terms',
    'Compute Advance Interest',
] as const

export const INTEREST_FINES_COMPUTATION_DIMINISHING = [
    'None',
    'By Amortization',
    'By Amortization Daly on Interest Principal + Interest = Fines(Arr)',
] as const

export const INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY =
    [
        'None',
        'By Daily on Interest based on loan balance by year Principal + Interest Amortization = Fines Fines Grace Period Month end Amortization',
    ] as const

export const EARNED_UNEARNED_INTEREST = [
    'None',
    'By Formula',
    'By Formula + Actual Pay',
    'By Advance Interest + Actual Pay',
] as const

export const LOAN_SAVING_TYPE = [
    'Separate',
    'Single Ledger',
    'Single Ledger if Not Zero',
    'Single Ledger Semi (15/30)',
    'Single Ledger Semi Within Maturity',
] as const

export const INTEREST_DEDUCTION = ['Above', 'Below'] as const

export const OTHER_DEDUCTION_ENTRY = ['None', 'Health Care'] as const

export const INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT = [
    'Spread',
    '1st Payment',
] as const

export const OTHER_INFORMATION_OF_AN_ACCOUNT = [
    'None',
    'Jewelry',
    'Grocery',
    'Track Loan Deduction',
    'Restructured',
    'Cash in Bank / Cash in Check Account',
    'Cash on Hand',
] as const

export const ACCOUNT_EXCLUSIVE_SETTING_TYPE = [
    'None',
    'Is Internal',
    'Cash on Hand',
    'Paid up share capital',
] as const
