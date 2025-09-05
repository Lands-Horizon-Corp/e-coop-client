import { IAuditable, IOrgBranchIdentity, ITimeStamps, TEntityId } from '@/types'

import { ICashCheckVoucherResponse } from '../cash-check-voucher/cash-check-voucher.types'

export interface ICashCheckVoucherTagRequest {
    cash_check_voucher_id: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface ICashCheckVoucherTagResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    cash_check_voucher_id: TEntityId
    cash_check_voucher?: ICashCheckVoucherResponse
    name: string
    description: string
    category: string
    color: string
    icon: string
}
