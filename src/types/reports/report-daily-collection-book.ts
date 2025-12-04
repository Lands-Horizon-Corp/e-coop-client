export interface InterfaceDailyCollectionBookReport {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string

    from_date: string
    to_date: string

    account_entries: [
        {
            account_title: string
            debit: number
            credit: number
        },
    ]
    total_debit: number
    total_credit: number

    prepared_by: string
    checked_by: string
    approved_by: string
}
