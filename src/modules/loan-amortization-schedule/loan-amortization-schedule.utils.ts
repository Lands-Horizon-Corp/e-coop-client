import { ILoanAmortizationSchedule } from './loan-amortization-schedule.types'

export const scheduleToTableRow = (
    loanSchedules: ILoanAmortizationSchedule[]
) => {
    const rows = []

    for (const schedule of loanSchedules) {
        const row: Record<string, unknown> = {
            scheduled_date: schedule.scheduled_date,
            actual_date: schedule.actual_date,
            days_skipped: schedule.days_skipped,
            total: schedule.total,
            balance: schedule.balance,
        }

        for (const accountValue of schedule.accounts) {
            row[accountValue.account.name] = {
                value: accountValue.value,
                total: accountValue.total,
            }
        }

        rows.push(row)
    }

    return rows
}
