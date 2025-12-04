export interface IReportTrialBalanceHeader {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    as_of_date: string

    account_entries: [
        {
            account_title: string
            previous_month_debit: number
            previous_month_credit: number
            current_month_debit: number
            current_month_credit: number
            balance_debit: number
            balance_credit: number
        },
    ]

    grand_total_previous_month_debit: number
    grand_total_previous_month_credit: number
    grand_total_current_month_debit: number
    grand_total_current_month_credit: number

    grand_total_balance_debit: number
    grand_total_balance_credit: number

    prepared_by: string
    check_by: string
    approved_by: string

    page_number?: number
    user_id: string
    report_date: string
    time: string
}
