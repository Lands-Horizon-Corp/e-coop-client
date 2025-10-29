import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ITimeDepositType } from '../time-deposit-type'
import { TimeDepositComputationPreMatureSchema } from './time-deposit-computation-pre-mature.validation'

export interface ITimeDepositComputationPreMature extends IBaseEntityMeta {
    time_deposit_type_id: TEntityId
    time_deposit_type: ITimeDepositType
    terms: number
    from: number
    to: number
    rate: number
}

export type ITimeDepositComputationPreMatureRequest = z.infer<
    typeof TimeDepositComputationPreMatureSchema
>

export interface ITimeDepositComputationPreMaturePaginated
    extends IPaginatedResult<ITimeDepositComputationPreMature> {}
