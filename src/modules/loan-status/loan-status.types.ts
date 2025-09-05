import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { LoanStatusSchema } from './loan-status.validation'

export interface ILoanStatus extends IBaseEntityMeta {
    name: string
    icon: string
    color: string
    description: string
}

export type ILoanStatusRequest = z.infer<typeof LoanStatusSchema>

export interface ILoanStatusPaginated extends IPaginatedResult<ILoanStatus> {}
