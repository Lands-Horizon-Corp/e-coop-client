import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { MutualAidContributionSchema } from './mutual-aid-contribution.validation'

export interface IMutualAidContribution extends IBaseEntityMeta {
    months_from: number
    months_to: number
    amount: number
}

export type IMutualAidContributionRequest = z.infer<
    typeof MutualAidContributionSchema
>

export interface IMutualAidContributionPaginated
    extends IPaginatedResult<IMutualAidContribution> {}
