import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'

export const MUTUAL_FUND_COMPUTATION_TYPE_LABELS: Record<
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number],
    string
> = {
    total_amount: 'Total Amount',
    by_amount: 'By Amount',
    by_member_amount: 'By Member Amount',
    by_member_class_amount: 'By Member Class Amount',
    by_membership_year: 'By Membership Year',
}
