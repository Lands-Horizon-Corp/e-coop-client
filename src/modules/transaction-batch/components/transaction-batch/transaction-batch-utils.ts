export type TTransactionBatchData = {
    total_supposed_remitance: number
    total_actual_remittance: number
}

type TransactionStatus = 'BALANCED' | 'OVERAGE' | 'SHORTAGE'

export const getTransactionStatus = ({
    total_actual_remittance,
    total_supposed_remitance,
}: TTransactionBatchData): TransactionStatus => {
    if (total_actual_remittance > total_supposed_remitance) return 'OVERAGE'

    if (total_actual_remittance < total_supposed_remitance) return 'SHORTAGE'

    return 'BALANCED'
}

type CollectionInput = {
    total_cash_collection: number
    total_deposit_entry: number
    beginning_balance: number
}

type LessInput = {
    petty_cash: number
    loan_releases: number
    time_deposit_withdrawal: number
    savings_withdrawal: number
}

export const getCollectionTotal = (data: CollectionInput): number => {
    const { total_cash_collection, total_deposit_entry, beginning_balance } =
        data
    return (
        Number(total_cash_collection || 0) +
        Number(total_deposit_entry || 0) +
        Number(beginning_balance || 0)
    )
}

export const getLessTotal = (data: LessInput): number => {
    const {
        petty_cash,
        loan_releases,
        time_deposit_withdrawal,
        savings_withdrawal,
    } = data
    return (
        Number(petty_cash || 0) +
        Number(loan_releases || 0) +
        Number(time_deposit_withdrawal || 0) +
        Number(savings_withdrawal || 0)
    )
}
