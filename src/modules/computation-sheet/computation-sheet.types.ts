import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { ComputationSheetSchema } from './computation-sheet.validation'

export interface IComputationSheet extends IBaseEntityMeta {
    name: string
    description?: string

    deliquent_account: boolean
    fines_account: boolean
    interest_account: boolean
    comaker_account: number
    exist_account: boolean

    created_at: string
    updated_at: string
    deleted_at?: string
}

export type IComputationSheetRequest = z.infer<typeof ComputationSheetSchema>

export interface IComputationSheetPaginated extends IPaginatedResult<IComputationSheet> {}
