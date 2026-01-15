import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'

export const MUTUAL_FUND_COMPUTATION_TYPE_LABELS: Record<
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number],
    string
> = {
    continuous: 'Continuous',
    up_to_zero: 'Up to Zero',
    sufficient: 'Sufficient',
    by_membership_year: 'By Membership Year',
}

export const MUTUAL_FUND_COMPUTATION_TYPE_DESCRIPTIONS: Record<
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number],
    string
> = {
    continuous: 'Continuous computation - allows even negative amount/balance',
    up_to_zero:
        'Up to zero - okay as long as there is a balance (e.g., balance 20, need 50 is acceptable if there is balance)',
    sufficient:
        'Sufficient - only includes if balance is greater than needed amount (e.g., if owed 20 and need 50, will not be included)',
    by_membership_year:
        'By membership year - uses amount from the table scheme based on membership duration (1-12 months), fallback to claim amount if not found',
}
