import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { CashCheckVoucherTagSchema } from './cash-check-voucher-tag.validation'

export interface ICashCheckVoucherTag extends IBaseEntityMeta {
    name: string
    description: string
    color: string
    icon: string
}

export type ICashCheckVoucherTagRequest = z.infer<
    typeof CashCheckVoucherTagSchema
>

export interface ICashCheckVoucherTagPaginated
    extends IPaginatedResult<ICashCheckVoucherTag> {}
