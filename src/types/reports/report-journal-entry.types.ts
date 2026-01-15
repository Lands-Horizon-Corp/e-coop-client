export interface IReportJournalVoucherEntry {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string

    pay_to: string
    address: string
    particulars: string

    voucher_no: string
    entry_date: string
    print_date: string
    amount: number
    date: string

    total_credit: number
    total_debit: number

    account_entries: Array<{
        account_title: string
        debit: number
        credit: number
    }>

    check_date: string
    check_no: string

    status: string
    count: number

    prepared_by: string
    approved_by: string
}
