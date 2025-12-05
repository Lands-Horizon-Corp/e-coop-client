export interface IReportAccountHistory {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    account_title: string

    accounts_entries: Array<{
        account_title: string
        accounts: Array<{
            account_title: string
            reference_number: string
            check_number?: string
            debit: number
            credit: number
            balance: number
            type: string
            passbook_number: string
            name: string
            date: string
            particulars: string
        }>
        sub_total_debit: number
        sub_total_credit: number
        sub_total_balance: number
    }>

    user_id: string
    report_date: string
    time: string
    page_number: number
}
