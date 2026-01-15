export interface ReportGLBooksHeader {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    from_date: string
    to_date: string
    gl_account_entries: Array<{
        account_title: string
        debit: number
        credit: number
    }>
    grand_total_debit: number
    grand_total_credit: number

    prepared_by: string
    check_by: string
    approved_by: string

    user_id: string
    report_date: string
    time: string
}
