import {
    ILoanAccountSummary,
    ILoanGuide,
    ILoanPaymentSchedule,
} from './loan-guide.types'

export interface LoanGuideTimelineRow {
    payment_date: string

    month: string

    schedules: Record<string, ILoanPaymentSchedule | null>
}

/**
 * Extracts all unique payment dates across all loan accounts
 * and sorts them chronologically.
 */
export function extractAndSortPaymentDates(loanGuide: ILoanGuide): string[] {
    const dates = new Set<string>()

    loanGuide.loan_accounts.forEach((account) => {
        account.payment_schedules.forEach((schedule) => {
            if (schedule.payment_date) {
                dates.add(schedule.payment_date)
            }
        })
    })

    return Array.from(dates).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )
}

/**
 * Builds a UI-ready payment timeline:
 * - Rows = payment dates
 * - Columns = loan accounts
 * - Empty cells are explicitly `null`
 */
export function buildLoanGuideTimeline(
    loanGuide: ILoanGuide
): LoanGuideTimelineRow[] {
    const sortedDates = extractAndSortPaymentDates(loanGuide)

    /**
     * Pre-index schedules per account for O(1) lookups
     */
    const accountScheduleMaps = loanGuide.loan_accounts.map((account) => ({
        accountId: account.loan_account.id,
        schedulesByDate: new Map(
            account.payment_schedules.map((s) => [s.payment_date, s])
        ),
    }))

    return sortedDates.map((date) => {
        const schedules: Record<string, ILoanPaymentSchedule | null> = {}

        accountScheduleMaps.forEach((account) => {
            schedules[account.accountId] =
                account.schedulesByDate.get(date) ?? null
        })

        return {
            payment_date: date,
            formatted_date: formatPaymentDate(date),
            month: getMonthShortName(date),
            schedules,
        }
    })
}

/**
 * Formats a payment date for display (e.g. "January 5")
 */
export function formatPaymentDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    })
}

/**
 * Returns short month name (e.g. "Jan")
 */
export function getMonthShortName(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
    })
}

/**
 * Groups timeline rows by month for UI sections / headers
 */
export function groupTimelineByMonth(
    timeline: LoanGuideTimelineRow[]
): Record<string, LoanGuideTimelineRow[]> {
    return timeline.reduce<Record<string, LoanGuideTimelineRow[]>>(
        (acc, row) => {
            acc[row.month] ??= []
            acc[row.month].push(row)
            return acc
        },
        {}
    )
}

/**
 * Returns loan accounts in display order
 */
export function getLoanAccounts(loanGuide: ILoanGuide): ILoanAccountSummary[] {
    return loanGuide.loan_accounts
}
