import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { JournalVoucherTagSchema } from './journal-voucher-tag.validation'

export interface IJournalVoucherTag extends IBaseEntityMeta {
    journal_voucher_id?: TEntityId
    name: string
    description: string
    category: string
    color: string
    icon: string
}

export type JournalVoucherTagRequest = {
    journal_voucher_id?: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}
export type IJournalVoucherTagRequest = z.infer<typeof JournalVoucherTagSchema>

export interface IJournalVoucherTagPaginated
    extends IPaginatedResult<IJournalVoucherTag> {}
