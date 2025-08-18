import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '../common'
import { entityIdSchema } from '../common'
import { IUserBase } from '../user/user.types'

export interface ICashCount extends IBaseEntityMeta {
    id: TEntityId

    employee_user_id?: string
    employee_user?: IUserBase

    transaction_batch_id?: string

    country_code: string
    name: string // this is just for comparison of coins
    bill_amount: number
    quantity: number
    amount: number
}

export interface ICashCountRequest {
    id?: TEntityId

    organization_id?: TEntityId
    branch_id?: TEntityId
    transaction_batch_id?: TEntityId

    employee_user_id?: TEntityId

    name: string
    country_code: string
    bill_amount: number // this is just for comparison of coins
    quantity: number
    amount: number
}

export interface ICashCountBatchRequest {
    cash_counts: ICashCountRequest[]
    deleted_cash_counts?: TEntityId[]
    deposit_in_bank?: number
    cash_count_total?: number
    grand_total?: number
}

export interface ICashCountPaginated extends IPaginatedResult<ICashCount> {}

export const cashCountSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),

    country_code: z.string().min(2, 'Invalid country'),
    name: z.string().min(1, 'name required'),
    bill_amount: z.coerce.number(),
    quantity: z.coerce.number(),
    amount: z.coerce.number(),
})

export const cashCountBatchSchema = z.object({
    cash_counts: z.array(cashCountSchema),
    deleted_cash_counts: z.array(z.string().uuid()).optional(),
    deposit_in_bank: z.coerce.number().optional(),
    cash_count_total: z.coerce.number().optional(),
    grand_total: z.coerce.number().optional(),
})
