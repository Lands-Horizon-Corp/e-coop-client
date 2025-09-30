import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ICashCheckVoucher } from '../cash-check-voucher/cash-check-voucher.types'
import { IMemberProfile } from '../member-profile'
import { ITransactionBatch } from '../transaction-batch'
import { IUser } from '../user'

export interface ICashCheckVoucherEntry extends IBaseEntityMeta {
    member_profile_id?: string
    member_profile?: IMemberProfile

    employee_user_id?: string
    employee_user?: IUser

    transaction_batch_id?: string
    transaction_batch?: ITransactionBatch

    account_id?: string
    account?: IAccount

    cash_check_voucher_id?: string
    cash_check_voucher?: ICashCheckVoucher

    description: string
    debit: number
    credit: number
}

export interface ICashCheckVoucherEntryRequest {
    id?: TEntityId
    rowId?: string

    member_profile?: IMemberProfile
    member_profile_id?: TEntityId

    account?: IAccount
    account_id?: TEntityId

    employee_user_id?: TEntityId

    description?: string
    debit: number
    credit: number
}

export interface ICashCheckVoucherEntryPaginated
    extends IPaginatedResult<ICashCheckVoucherEntry> {}
