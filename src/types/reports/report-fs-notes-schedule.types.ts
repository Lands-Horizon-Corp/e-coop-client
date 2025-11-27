export interface IReportBalance {
    header_title: string
    header_address: string
    tax_number: string

    as_of_date: string
    assets_entries: [
        {
            account_title: string
            accounts: [
                {
                    account_title: string
                    amount: number
                    previous_amount?: number
                    inc_or_dec?: string
                },
            ]
        },
    ]

    total_current_assets: number
    long_term_investment: number
    total_long_term_investment: number
    property_and_equipment: number
    total_assets: number

    user_id: string
    report_date: string
    time: string
}
