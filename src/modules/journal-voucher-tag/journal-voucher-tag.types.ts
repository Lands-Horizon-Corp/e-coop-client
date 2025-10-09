import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

export interface IJournalVoucherTag extends IBaseEntityMeta {
    journal_voucher_id?: TEntityId
    name: string
    description: string
    category: string
    color: string
    icon: string
}

export type IJournalVoucherTagRequest = {
    journal_voucher_id?: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface IJournalVoucherTagPaginated
    extends IPaginatedResult<IJournalVoucherTag> {}
