export interface IReportIncomeStatement {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    ended_date: string

    income_entries: [
        {
            account_title: string
            account_entries: [
                {
                    description: string
                    current_amount: number
                    previous_amount?: number
                    inc_or_dec?: string
                    percentage?: number
                },
            ]
            total_account_amount: number
        },
    ]
    total_income: number

    expense_entries: [
        {
            account_title: string
            account_entries: [
                {
                    description: string
                    amount: number
                },
            ]
            total_account_amount: number
        },
    ]

    total_financial_cost: number
    personnel_cost: number
    total_personnel_cost: number
    administrative_cost: number
    total_expense: number

    net_surplus: number

    prepared_by: string
    check_by: string
    approved_by: string
}
