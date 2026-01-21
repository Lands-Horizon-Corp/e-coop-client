import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { CancelledCashCheckVoucherSchema } from './cancelled-cash-check-voucher.validation'

export interface ICancelledCashCheckVoucher extends IBaseEntityMeta {
    check_number: string
    entry_date: string
    description?: string
}

export type ICancelledCashCheckVoucherRequest = z.infer<
    typeof CancelledCashCheckVoucherSchema
>

export interface ICancelledCashCheckVoucherPaginated
    extends IPaginatedResult<ICancelledCashCheckVoucher> {}
