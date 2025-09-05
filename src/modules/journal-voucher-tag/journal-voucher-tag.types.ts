import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IJournalVoucherResponse } from '../journal-voucher/journal-voucher.types'

export interface IJournalVoucherTagRequest {
    journal_voucher_id: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface IJournalVoucherTagResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    journal_voucher_id: TEntityId
    journal_voucher?: IJournalVoucherResponse
    name: string
    description: string
    category: string
    color: string
    icon: string
}
