export const MUTUAL_FUND_COMPUTATION_TYPES = [
    'total_amount',
    'by_amount',
    'by_member_amount',
    'by_member_class_amount',
    'by_membership_year',
] as const

export type MutualFundComputationType =
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number]
