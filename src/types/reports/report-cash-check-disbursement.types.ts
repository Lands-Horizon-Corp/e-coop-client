export interface ICashCheckDisburment {
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

    account_entries: Array<{
        account_title: string
        debit: number
        credit: number
    }>

    cash_on_hand_total_credit: number
    cash_on_hand_total_debit: number

    total_credit: number
    total_debit: number

    check_no: string
    check_date: string

    total_amount_into_words: string

    prepared_by: string
    payee: string
    certified_correct: string
    paid_by: string
    approved_for_payment: string

    user_id: string
    report_date: string
    time: string
}
