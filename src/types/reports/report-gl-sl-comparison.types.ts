export interface IReportGLSLComparison {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    as_of_date: string
    account_entries: Array<{
        account_title: string
        gl_amount: number
        sl_amount: number
        variance: number
    }>

    prepared_by: string
    check_by: string
    approved_by: string

    user_id: string
    report_date: string
    time: string
}
