import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile'
import { ITransactionBatch } from '../transaction-batch'
import { IUser } from '../user'
import { TCashCheckVoucherEntrySchema } from './cash-check-voucher-entry.validation'

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
    cash_check_voucher_number?: string

    description: string
    debit: number
    credit: number
}

export type ICashCheckVoucherEntryRequest = TCashCheckVoucherEntrySchema

export interface ICashCheckVoucherEntryPaginated
    extends IPaginatedResult<ICashCheckVoucherEntry> {}
