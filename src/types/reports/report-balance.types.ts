export interface IReportBalance {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    as_of_date: string

    asset_entries: [
        {
            account_title: string
            account_entries: [
                {
                    description: string
                    amount: number
                    inc_or_dec?: string
                    previous_amount?: number
                    percentage?: number
                },
            ]
            total_cash_in_bank: number
            petty_cash_fund: number
        },
    ]
    total_property_and_equipment: number
    total_assets: number

    user_id: string
    report_date: string
    time: string
}
