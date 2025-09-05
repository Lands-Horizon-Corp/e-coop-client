import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IBranch } from '../branch'
import { IMemberProfile } from '../member-profile/member-profile.types'
import { MemberExpenseSchema } from './member-expense.validation'

// LATEST FROM ERD
export type IMemberExpenseRequest = z.infer<typeof MemberExpenseSchema>

// LATEST FROM ERD
export interface IMemberExpense extends IBaseEntityMeta {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    branch_id: TEntityId
    branch: IBranch

    name: string
    amount: number
    description: string
}
