import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ICollateral } from '../collateral'
import { ComakerCollateralSchema } from './comaker-collateral.validation'

export interface IComakerCollateral extends IBaseEntityMeta {
    loan_transaction_id: TEntityId
    collateral_id: TEntityId
    collateral: ICollateral
    amount: number
    months_count: number
    year_count: number
}

export type IComakerCollateralRequest = z.infer<typeof ComakerCollateralSchema>

export interface IComakerCollateralPaginated
    extends IPaginatedResult<IComakerCollateral> {}
