import { IReportBase } from './report-base'

type TModeOfPayment =
    | 'Daily'
    | 'Daily'
    | 'Weekly'
    | 'Semi-Monthly'
    | 'Monthly'
    | 'Quarterly'
    | 'Semi-Annual'
    | 'Lump Sum'

type TLoanTransactionEntry = {
    account_title: string
    debit: number
    credit: number
}

export interface ILoanReleaseVoucher extends IReportBase {
    pay_to: string
    address: string
    contact: string

    voucher_no: number
    date_release: string
    terms: number
    mode_of_payment: TModeOfPayment
    processor: string

    due_date: string
    loan_transaction_entries: TLoanTransactionEntry[]
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
