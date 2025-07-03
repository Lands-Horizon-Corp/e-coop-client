import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'

import { IAccount } from './accounts/account'
import { IPaginatedResult } from './paginated-result'

export const GENERAL_LEDGER_SOURCES = [
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'journal voucher',
    'check voucher',
] as const

export type GeneralLedgerSource = (typeof GENERAL_LEDGER_SOURCES)[number]

export interface ITransaction extends ITimeStamps, IAuditable {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    account_id: TEntityId
    account?: IAccount

    signature_media_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId
    member_profile_id?: TEntityId
    member_joint_account_id?: TEntityId

    loan_balance: number
    loan_due: number
    total_due: number
    fines_due: number
    total_loan: number
    interest_due: number

    transaction_reference_number: string
    reference_number: string
    source: GeneralLedgerSource

    amount: number
    description: string
}

export interface ITransactionPaginated extends IPaginatedResult<ITransaction> {}
