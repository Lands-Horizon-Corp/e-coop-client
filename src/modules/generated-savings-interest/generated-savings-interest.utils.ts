import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from './generated-savings-interest.constant'

export const COMPUTATION_TYPE_LABELS: Record<
    (typeof GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES)[number],
    string
> = {
    daily_lowest_balance: 'Daily Lowest Balance',
    average_daily_balance: 'Average Daily Balance',
    monthly_end_lowest_balance: 'Monthly End Lowest Balance',
    adb_end_balance: 'ADB End Balance',
    monthly_lowest_balance_average: 'Monthly Lowest Balance Average',
    monthly_end_balance_average: 'Monthly End Balance Average',
    monthly_end_balance_total: 'Monthly End Balance Total',
}
