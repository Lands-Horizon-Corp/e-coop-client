export interface ILoanReleaseVoucher {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    pay_to: string
    address: string
    contact: string

    voucher_no: number
    date_release: string
    terms: number
    mode_of_payment: string
    processor: string

    due_date: string
    loan_transaction_entries: Array<{
        account_title: string
        debit: number
        credit: number
    }>
    cash_on_hand_total_debit: number
    cash_on_hand_total_credit: number

    total_debit: number
    total_credit: number
    total_amount_in_words: string

    prepared_by: string
    payeee: string
    cetified_correct: string
    paid_by: string

    approved_for_payment: string
}
