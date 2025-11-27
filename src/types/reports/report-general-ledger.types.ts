export interface IReportGeneralLedger {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    from_date: string
    to_date: string

    genera_ledger_entries: [
        {
            account_title: string
            ledger_items: [
                {
                    voucher_no: string
                    source: string
                    month: string
                    debit: number
                    credit: number
                    balance: number
                },
            ]
            month_end_balance_credit: number
            month_end_balance_debit: number
        },
    ]

    user_id: string
    report_date: string
    time: string
}
