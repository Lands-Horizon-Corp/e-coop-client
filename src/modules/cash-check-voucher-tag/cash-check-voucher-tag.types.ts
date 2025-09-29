import { IAuditable, IOrgBranchIdentity, ITimeStamps, TEntityId } from '@/types'

import { ICashCheckVoucher } from '../cash-check-voucher/cash-check-voucher.types'

export interface ICashCheckVoucherTagRequest {
    cash_check_voucher_id: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface ICashCheckVoucherTag
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    cash_check_voucher_id: TEntityId
    cash_check_voucher?: ICashCheckVoucher
    name: string
    description: string
    category: string
    color: string
    icon: string
}
