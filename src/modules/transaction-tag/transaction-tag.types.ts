import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

export const TRANSACTION_TAG_CATEGORIES = [
    'accounting',
    'voucher',
    'cash / check voucher',
    'journal voucher',
    'adjustment',
    'transaction',
    'general acconting ledger',
] as const

export type TransactionTagCategory = (typeof TRANSACTION_TAG_CATEGORIES)[number]

export interface ITransactionTag extends IBaseEntityMeta {
    transaction_id: TEntityId
    name: string
    description: string
    category: TransactionTagCategory
    color: string
    icon: string
}

export interface ITransactionTagRequest {
    organization_id: TEntityId
    branch_id: TEntityId

    name: string
    description: string
    category: TransactionTagCategory
    color: string
    icon: string
}

export interface ITransactionTagPaginated
    extends IPaginatedResult<ITransactionTag> {}
