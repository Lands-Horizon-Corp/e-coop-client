import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { FinancialStatementTitleSchema } from './financial-statement-title.validation'

export interface IFinancialStatementTitle extends IBaseEntityMeta {
    id: TEntityId
    title: string

    total_title: string
    exclude_consolidate_total: boolean

    index: number
    color: string
}

export type IFinancialStatementTitleRequest = z.infer<
    typeof FinancialStatementTitleSchema
>

export interface IFinancialStatementTitlePaginated extends IPaginatedResult<IFinancialStatementTitle> {}
